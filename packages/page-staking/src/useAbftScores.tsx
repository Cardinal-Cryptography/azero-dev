// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AbftScores } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi } from '@polkadot/react-hooks';

import useSessionInfo from './Performance/useSessionInfo.js';
import { decodeChainAbftScore, fetchAbtfScoreForSession } from './util.js';

/**
 * Retrieving ABFT scores from the storage for the past sessions, and from the current session.
 * For the past sessions, it retrieves, in a sort of pipeline fashion, below data, for each session passed as input
 *    - last session block,
 *    - api from that block,
 *    - api.query.aleph.abftScores(session)
 *  This logic might seem complicated  - why not just call api.query.aleph.abftScores(somePastSession) via current API?
 *  Because in each session % 960 == 0, the ABFT score storage is cleared, and validator needs to access past score data
 *  regardless.
 *
 *  For the current session, it uses the current api.query.aleph.abftScores.
 * @param sessions An array of session numbers. Only past or current session numbers can be called.
 */
function useAbftScoresImpl (sessions: number[]): AbftScores[] {
  const { api } = useApi();

  const sessionInfo = useSessionInfo();
  const currentSession = sessionInfo?.currentSession;

  const [abftScores, setAbftScores] = useState<AbftScores[]>([]);

  useEffect(() => {
    if (currentSession === undefined) {
      return;
    }

    Promise.all(
      sessions
        .map(
          (sessionNo) =>
            fetchAbtfScoreForSession(sessionNo, api, currentSession).catch(() => undefined)
        )
    ).then((chainAbftScores) =>
      setAbftScores(chainAbftScores.map((chainAbftScore, index) =>
        decodeChainAbftScore(chainAbftScore, sessions[index])
      ))
    ).catch(() => undefined);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [currentSession, api, JSON.stringify(sessions)]);

  return abftScores;
}

export default createNamedHook('useAbftScoresImpl', useAbftScoresImpl);
