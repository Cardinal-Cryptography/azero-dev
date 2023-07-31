// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StakerState } from '@azero.dev/react-hooks/types';

import { useMemo } from 'react';

import { createNamedHook } from '@azero.dev/react-hooks';

function useOwnNominatorsImpl (ownStashes?: StakerState[]): StakerState[] | undefined {
  return useMemo(
    () => ownStashes && ownStashes.filter(({ isOwnController, isStashValidating }) =>
      isOwnController &&
      !isStashValidating
    ),
    [ownStashes]
  );
}

export default createNamedHook('useOwnNominators', useOwnNominatorsImpl);
