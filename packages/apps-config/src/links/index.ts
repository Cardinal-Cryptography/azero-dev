// Copyright 2017-2024 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ExternalDef } from './types.js';

<<<<<<< HEAD
import { AzeroId, TzeroId } from './azeroId.js';
||||||| 2b40308a49
import { CereStats } from './cerestats.js';
import { Commonwealth } from './commonwealth.js';
import { Dotreasury } from './dotreasury.js';
import { Edgscan } from './edgscan.js';
import { KodaDot } from './kodadot.js';
import { MoonbeamApps } from './moonbeamApps.js';
import { Polkaholic } from './polkaholic.js';
import { Polkascan } from './polkascan.js';
import { PolkassemblyIo, PolkassemblyNetwork } from './polkassembly.js';
import { Singular } from './singular.js';
import { Statescan } from './statescan.js';
import { SubId } from './subid.js';
=======
import { CereStats } from './cerestats.js';
import { Commonwealth } from './commonwealth.js';
import { Dotreasury } from './dotreasury.js';
import { Edgscan } from './edgscan.js';
import { KodaDot } from './kodadot.js';
import { MoonbeamApps } from './moonbeamApps.js';
import { Polkascan } from './polkascan.js';
import { PolkassemblyIo, PolkassemblyNetwork } from './polkassembly.js';
import { Singular } from './singular.js';
import { Statescan } from './statescan.js';
import { SubId } from './subid.js';
>>>>>>> a0-ops-upstream-automerge
import { Subscan } from './subscan.js';

export const externalLinks: Record<string, ExternalDef> = {
<<<<<<< HEAD
  'AZERO.ID': AzeroId,
  'TZERO.ID': TzeroId,
  // eslint-disable-next-line sort-keys
  Subscan
||||||| 2b40308a49
  CereStats,
  Commonwealth,
  Dotreasury,
  Edgscan,
  KodaDot,
  MoonbeamApps,
  Polkaholic,
  Polkascan,
  PolkassemblyIo,
  PolkassemblyNetwork,
  'Singular (NFTs)': Singular,
  Statescan,
  SubId,
  Subscan,
  Subsquare
=======
  CereStats,
  Commonwealth,
  Dotreasury,
  Edgscan,
  KodaDot,
  MoonbeamApps,
  Polkascan,
  PolkassemblyIo,
  PolkassemblyNetwork,
  'Singular (NFTs)': Singular,
  Statescan,
  SubId,
  Subscan,
  Subsquare
>>>>>>> a0-ops-upstream-automerge
};
