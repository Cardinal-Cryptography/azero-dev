// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId32 } from '@polkadot/types/interfaces';
import type { Option } from '@polkadot/types-codec';
import type { BanInfo } from './index.js';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

 type BannedEntry = [{ args: [AccountId32] }, Option<BanInfo>];

export interface Banned {
  readonly account: string,
  readonly banInfo: BanInfo,
}

function useBannedImpl () {
  const { api } = useApi();

  const bannedStorageMap = useCall<BannedEntry[]>(api.query.committeeManagement.banned.entries);

  return useMemo((): Banned[] | undefined => {
    if (bannedStorageMap) {
      return bannedStorageMap.filter(([, values]) => values.isSome)
        .map(([key, values]) => {
          const account = key.args[0].toString();

          return {
            account,
            banInfo: values.unwrap()
          };
        });
    }

    return undefined;
  },
  [bannedStorageMap]
  );
}

export default createNamedHook('useBanned', useBannedImpl);
