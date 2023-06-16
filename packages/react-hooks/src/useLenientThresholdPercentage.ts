// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Perquintill } from '@polkadot/types/interfaces/runtime';

import getCommitteeManagement from '@polkadot/react-api/getCommitteeManagement';
import { BN, BN_QUINTILL } from '@polkadot/util';

import { createNamedHook } from './createNamedHook.js';
import { useApi } from './useApi.js';
import { useCall } from './useCall.js';

const BACKWARD_COMPATIBLE_LENIENT_THRESHOLD = 90;

// preserved percentage precision is four digits - e.g. 57.75%
const PERCENTAGE_MUL = new BN(10_000);

function useLenientThresholdPercentageImpl (): number | undefined {
  const { api } = useApi();

  const lenientThresholdFn = getCommitteeManagement(api).query.lenientThreshold;
  const isLenientThresholdDefined = !!lenientThresholdFn;

  const lenientThresholdPerquintill = useCall<Perquintill>(lenientThresholdFn);

  if (!isLenientThresholdDefined) {
    return BACKWARD_COMPATIBLE_LENIENT_THRESHOLD;
  }

  if (lenientThresholdPerquintill === undefined) {
    return undefined;
  }

  return lenientThresholdPerquintill.mul(PERCENTAGE_MUL).div(BN_QUINTILL).toNumber() / 100;
}

export const useLenientThresholdPercentage = createNamedHook('useLenientThresholdPercentage', useLenientThresholdPercentageImpl);
