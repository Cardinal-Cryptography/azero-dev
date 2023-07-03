// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { AccountId32 } from '@polkadot/types/interfaces/runtime';
import type { u32, Vec } from '@polkadot/types-codec';

import { useEffect, useState } from 'react';

import getCommitteeManagement from '@polkadot/react-api/getCommitteeManagement';

import { useApi } from './useApi.js';

export const useAlephBFTCommittee = (session: number): string[] | undefined => {
  const { api } = useApi();

  const [committee, setCommittee] = useState<string[]>();

  useEffect(() => {
    getAlephBFTCommittee(session, api)
      .then(setCommittee)
      .catch(console.error);
  }, [api, session]);

  return committee;
};

const getAlephBFTCommittee = async (session: number, api: ApiPromise) => {
  // Committee must be set on the last block of the preceding session.
  const blocksInSession = (getCommitteeManagement(api).consts.sessionPeriod as u32).toNumber();
  const lastBlockOfPrecedingSession = session * blocksInSession - 1;

  const blockHash = await api.rpc.chain.getBlockHash(lastBlockOfPrecedingSession);
  const apiAtBlock = await api.at(blockHash);

  // `nextFinalityCommittee` isn't defined on all blocks in the past.
  const optionalCommitteePromise = (
    apiAtBlock.query.aleph.nextFinalityCommittee?.() as Promise<Vec<AccountId32>> | undefined
  );

  if (!optionalCommitteePromise) {
    return [];
  }

  return (await optionalCommitteePromise).map((accountId) => accountId.toHuman());
};
