// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, Struct, Vec } from '@polkadot/types';
import type { Hash, SessionIndex } from '@polkadot/types/interfaces';
import type { Codec } from '@polkadot/types/types';
import type { u16, u32 } from '@polkadot/types-codec';

import { useEffect, useMemo, useState } from 'react';

import { getCommitteeManagement } from '@polkadot/react-api/getCommitteeManagement';
import { createNamedHook, useApi } from '@polkadot/react-hooks';

import { getSessionFirstAndLastBlock } from '../util.js';
import useSessionInfo from './useSessionInfo.js';

// Represents type directly as chain storage. sessionId and nonce are not used by the logic below, and are there only
// for decoding.
interface ChainAbftScore extends Struct {
  sessionId: SessionIndex;
  nonce: u32;
  points: Vec<u16>;
}

type Score = number;
interface AbftScore {
  nodeIndex: number;
  score: Score;
}

/**
 * ABFT score for finalization committee in a session. This hook outputs an array of those objects.
 * Session number is always populated. `abftScore` can be an empty array, which happens in any of the below scenarios:
 *    - finality version is < 5, ie scores are not enabled
 *    - Option<ChainAbftScore> value is None in the chain storage
 *    - scores are not yet aggregated (roughly this means we are in the first 60 seconds of the session)
 */
export interface AbftScores {
  session: number;
  abftScore: AbftScore[];
}

function decodeChainAbftScore (chainAbftScore: Codec, sessions: number[], scoresEnabled: boolean[], index: number) {
  const maybeChainAbftScore = chainAbftScore as unknown as Option<ChainAbftScore>;

  if (maybeChainAbftScore.isSome && scoresEnabled[index]) {
    const chainAbftScore = maybeChainAbftScore.unwrap();
    const abftScores = chainAbftScore.points.map((points, index) => ({
      nodeIndex: index,
      score: Number(points.toString())
    }));

    return {
      abftScore: abftScores,
      session: sessions[index]
    };
  } else {
    return {
      abftScore: [],
      session: sessions[index]
    };
  }
}

/**
 * Retrieving ABFT scores from the storage. This hook has essentialy two modes - current sessions and past session mode.
 * For current session, it retrieves data directly from current api storage api.query.aleph.abftScores(currentSession).
 * For the past sessions, it retrieves, in a sort of pipeline fashion, below data, for each sessions passed as input
 *    - last session block,
 *    - api from that block,
 *    - api.query.aleph.abftScores(session)
 *  This logic might seem complicated  - why not just call api.query.aleph.abftScores(somePastSession) via current API?
 *  Because in each session % 960 == 0, the ABFT score storage is cleared, and validator needs to access past score data
 *  regardless.
 * @param sessions An array of session numbers. Only past or current session numbers can be called.
 */
function AbftScoresImpl (sessions: number[]): AbftScores[] {
  const { api } = useApi();

  const sessionInfo = useSessionInfo();
  const [pastSessions, currentSession] = useMemo(() => {
    return [sessions.filter((session) => session !== sessionInfo?.currentSession), sessionInfo?.currentSession];
  }, [sessions, sessionInfo]);

  const [currentSessionAbftScore, setCurrentSessionAbftScore] = useState<AbftScores | undefined>(undefined);

  useEffect(() => {
    if (currentSession !== undefined) {
      api.query.aleph.abftScores(currentSession)
        .then((chainAbftScore) =>
          setCurrentSessionAbftScore(decodeChainAbftScore(chainAbftScore, [currentSession], [true], 0)))
        .catch(console.error);
    }
  }, [api, currentSession]);

  const [scoresEnabled, setScoresEnabled] = useState<boolean[]>([]);
  const sessionPeriod = Number(getCommitteeManagement(api).consts.sessionPeriod.toString());
  const [lastBlockInSessionsHashes, setLastBlockInSessionsHashes] = useState<Hash[]>([]);

  // TODO extract to separate hook
  useEffect(() => {
    if (api?.consts.elections) {
      const promises = pastSessions.map((session) =>
        api.rpc.chain.getBlockHash(getSessionFirstAndLastBlock(session, sessionPeriod).last));

      Promise.all(promises)
        .then((blockHashes) => setLastBlockInSessionsHashes(blockHashes.filter((hash) => !hash.isEmpty)))
        .catch(console.error);
    }
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, sessionPeriod, JSON.stringify(pastSessions)]
  );

  useEffect(() => {
    const promisesApisAtLastBlock = lastBlockInSessionsHashes.map((hash) =>
      api.at(hash.toString()));

    Promise.all(promisesApisAtLastBlock).then((lastBlockApis) => {
      const finalityVersionsPromises = lastBlockApis.map((api) => api.query.aleph.finalityVersion());

      Promise.all(finalityVersionsPromises)
        .then((finalityVersions) =>
          setScoresEnabled(finalityVersions.map((finalityVersion) => Number(finalityVersion.toString()) >= 5))
        )
        .catch(console.error);
    }).catch(console.error);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(lastBlockInSessionsHashes)]
  );

  const [abftScores, setAbftScores] = useState<AbftScores[]>([]);

  useEffect(() => {
    const promisesApisAtLastBlock = lastBlockInSessionsHashes.map((hash) =>
      api.at(hash.toString()));

    Promise.all(promisesApisAtLastBlock).then((lastBlockApis) => {
      const abftScoresPromises = lastBlockApis
        .map((api, index) => {
          return { api, session: pastSessions[index] };
        })
        .map(({ api, session }) => api.query.aleph.abftScores(session));

      Promise.all(abftScoresPromises)
        .then((chainAbftScores) => {
          const outputAbftScores = chainAbftScores.map((chainAbftScore, index) =>
            decodeChainAbftScore(chainAbftScore, pastSessions, scoresEnabled, index)
          );

          if (currentSessionAbftScore !== undefined) {
            outputAbftScores.push(currentSessionAbftScore);
          }

          setAbftScores(outputAbftScores);
        }
        )
        .catch(console.error);
    }).catch(console.error);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(lastBlockInSessionsHashes), JSON.stringify(pastSessions), JSON.stringify(scoresEnabled), currentSessionAbftScore]
  );

  return abftScores;
}

export default createNamedHook('AbftScores', AbftScoresImpl);
