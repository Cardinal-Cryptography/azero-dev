// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { selectableNetworks } from '@polkadot/networks';
import { assert, BN } from '@polkadot/util';

function getGenesis (name: string): string {
  const network = selectableNetworks.find(({ network }) => network === name);

  assert(network && network.genesisHash[0], `Unable to find genesisHash for ${name}`);

  return network.genesisHash[0];
}

export const KULUPU_GENESIS = getGenesis('kulupu');

export const KUSAMA_GENESIS = getGenesis('kusama');

export const POLKADOT_GENESIS = getGenesis('polkadot');
export const POLKADOT_DENOM_BLOCK = new BN(1248328);

export const ROCOCO_GENESIS = '0x6408de7737c59c238890533af25896a2c20608d8b380bb01029acb392781063e';

export const WESTEND_GENESIS = '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e';

export const NEATCOIN_GENESIS = '0xfbb541421d30423c9a753ffa844b64fd44d823f513bf49e3b73b3a656309a595';

export const DOCK_GENESIS = '0x6bfe24dca2a3be10f22212678ac13a6446ec764103c0f3471c71609eac384aae';

export const DOCK_POS_TESTNET_GENESIS = '0x59d93e2ce42abb8aa52ca9a9e820233667104751f8f2980578a47a26a7235027';

export const NFTMART_GENESIS = '0xfcf9074303d8f319ad1bf0195b145871977e7c375883b834247cb01ff22f51f9';

export const ALEPHZERO_TESTNET_GENESIS = '0x49574664f45654c043c2690b76b5bf4a05c49160e112d32b8b71b0dfb023169c';
export const ALEPHZERO_MAINNET_GENESIS = '0x70255b4d28de0fc4e1a193d7e175ad1ccef431598211c55538f1018651a0344e';
