// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import { useApi } from '@polkadot/react-hooks';

import { getFinalityCommittee } from '../util.js';

export const useFinalityCommittee = (session: number, currentSession: number): string[] | undefined => {
  const { api } = useApi();

  const [committee, setCommittee] = useState<string[]>();

  useEffect(() => {
    if (session <= currentSession) {
      getFinalityCommittee(session, api)
        .then(setCommittee)
        .catch(console.error);
    }
  }, [api, session, currentSession]);

  return committee;
};
