// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import { BN_THOUSAND, BN_ZERO, isBn, isFunction } from '@polkadot/util';

interface ToBN {
  toBn: () => BN;
}

export function balanceToNumber (amount: BN | ToBN = BN_ZERO, divisor: BN): number {
  const value = isBn(amount)
    ? amount
    : isFunction(amount.toBn)
      ? amount.toBn()
      : BN_ZERO;

  return value.mul(BN_THOUSAND).div(divisor).toNumber() / 1000;
}

export function getSessionFirstAndLastBlock (session: number, sessionPeriod: number) {
  // due to how AURA works, first block of the session is actually N + 1, 0th (genesis) block
  // is treated in a special way. N % sessions_period block is the last session block.
  // however, due to how pallet elections writes down session validator block count we need to
  // read that storage map from one block before last block, as in the last block counter is
  // cleared; so we adjust +1 per block author info from what AURA thinks last block is
  return {
    first: session * sessionPeriod + 1,
    last: (session + 1) * sessionPeriod - 1,
    lastPerAura: (session + 1) * sessionPeriod
  };
}

export function range (size: number, startAt = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}
