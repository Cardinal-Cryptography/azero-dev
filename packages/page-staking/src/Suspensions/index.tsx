// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u8, u32, Vec } from '@polkadot/types';
import type { Codec } from '@polkadot/types/types';

import React from 'react';

import CurrentList from './CurrentList.js';
import useSuspensions from './Suspensions.js';

export interface SuspensionEvent {
  address: string;
  era: number;
  suspensionReason: string;
  suspensionLiftsInEra: number;
}

export interface BanReason extends Codec{
  insufficientUptime?: u32,
  insufficientProduction?: u32,
  insufficientFinalization?: u32,
  otherReason?: Vec<u8>,
}
export interface BanInfo extends Codec {
  reason: BanReason,
  start: u32,
}

function SuspensionsPage (): React.ReactElement {
  const suspensions = useSuspensions();

  return (
    <section>
      <CurrentList
        suspensions={suspensions}
      />
    </section>
  );
}

export default React.memo(SuspensionsPage);
