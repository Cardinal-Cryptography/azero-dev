// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import { createNamedHook, useApi } from '@polkadot/react-hooks';
import { StorageKey } from '@polkadot/types';
import { Hash } from '@polkadot/types/interfaces';
import { AnyTuple, Codec } from '@polkadot/types/types';

export interface ValidatorPerformance {
  accountId: string,
  blockCount?: number,
}

export interface SessionCommitteePerformance {
  sessionId: number,
  performance: ValidatorPerformance[],
}

export function parseSessionBlockCount (sessionValidatorBlockCountValue: [StorageKey<AnyTuple>, Codec][]): [string, number][] {
  return sessionValidatorBlockCountValue.map(([key, values]) => {
    const account = key.args[0].toString();
    let count = Number(values.toString());

    return [account, count];
  });
}

function useSessionCommitteePerformanceImpl (sessions: number[]): Record<string, number> {
  const { api } = useApi();

  const [lastBlockInSessionsHashes, setLastBlockInSessionsHashes] = useState<Hash[]>([]);
  const [sessionValidatorBlockCountLookups, setSessionValidatorBlockCountLookups] = useState<[string, number][][]>([]);
  const [blockCounter, setBlockCounter] = useState<Record<string, number>>({});

  useEffect(() => {
    if (api && api.consts.elections) {
      const sessionPeriod = Number(api.consts.elections.sessionPeriod.toString());
      const promises = sessions.map((session) => api.rpc.chain.getBlockHash((session + 1) * sessionPeriod - 1));

      Promise.all(promises)
        .then((blockHashes) => setLastBlockInSessionsHashes(blockHashes.filter((hash) => !hash.isEmpty)))
        .catch(console.error);
    }
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(sessions)]
  );

  useEffect(() => {
    const promisesApisAtLastBlock = lastBlockInSessionsHashes.map((hash) => api.at(hash.toString()));

    Promise.all(promisesApisAtLastBlock).then((lastBlockApis) => {
      const promisesSessionValidatorBlockCountEntries = lastBlockApis.map((promise) => promise.query.elections.sessionValidatorBlockCount.entries());

      Promise.all(promisesSessionValidatorBlockCountEntries).then((entriesArray) =>
        setSessionValidatorBlockCountLookups(entriesArray.map((entries, index) => {
          return parseSessionBlockCount(entries);
        }))).catch(console.error);
    }).catch(console.error);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(lastBlockInSessionsHashes)]
  );


  useEffect(() => {
    let counter: Record<string, number> = {};

      if (sessions.length !== sessionValidatorBlockCountLookups.length) {
        return;
      }

      sessions.forEach((session, index) => {
        const sessionValidatorBlockCountLookup = sessionValidatorBlockCountLookups[index];
        console.log("sessionValidatorBlockCountLookup", sessionValidatorBlockCountLookup);
        sessionValidatorBlockCountLookup.forEach(([validator, blockCount]) => {
          if (Object.keys(counter).includes(validator) ) {
            counter[validator] += blockCount;
          } else {
            counter[validator] = 0;
          }

        });
    });
      setBlockCounter(counter);
  },

  // eslint-disable-next-line react-hooks/exhaustive-deps
  [JSON.stringify(sessionValidatorBlockCountLookups), JSON.stringify(sessions)]
  );

  return blockCounter;
}

export default createNamedHook('useSessionCommitteePerformance', useSessionCommitteePerformanceImpl);
