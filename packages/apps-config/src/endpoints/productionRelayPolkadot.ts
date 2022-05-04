// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from '../types';
import type { EndpointOption } from './types';

import { POLKADOT_GENESIS } from '../api/constants';

/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   value: The actual hosted secure websocket endpoint
//
// Alpahebtical based on text
export const prodParasPolkadot: EndpointOption[] = [
  {
    info: 'acala',
    homepage: 'https://acala.network/',
    paraId: 2000,
    text: 'Acala',
    providers: {
      'Acala Foundation 0': 'wss://acala-rpc-0.aca-api.network',
      'Acala Foundation 1': 'wss://acala-rpc-1.aca-api.network',
      // 'Acala Foundation 2': 'wss://acala-rpc-2.aca-api.network/ws', // https://github.com/polkadot-js/apps/issues/6965
      'Acala Foundation 3': 'wss://acala-rpc-3.aca-api.network/ws',
      'Polkawallet 0': 'wss://acala.polkawallet.io',
      OnFinality: 'wss://acala-polkadot.api.onfinality.io/public-ws',
      Dwellir: 'wss://acala-rpc.dwellir.com'
    }
  },
  {
    info: 'odyssey',
    homepage: 'https://www.aresprotocol.io/',
    paraId: 2028,
    text: 'Ares Odyssey',
    providers: {
      AresProtocol: 'wss://wss.odyssey.aresprotocol.io'
    }
  },
  {
    info: 'astar',
    homepage: 'https://astar.network',
    paraId: 2006,
    text: 'Astar',
    providers: {
      Astar: 'wss://rpc.astar.network',
      OnFinality: 'wss://astar.api.onfinality.io/public-ws',
      Dwellir: 'wss://astar-rpc.dwellir.com'
    }
  },
  {
    info: 'bifrost',
    isUnreachable: true,
    homepage: 'https://crowdloan.bifrost.app',
    paraId: 2030,
    text: 'Bifrost',
    providers: {
      Liebi: 'wss://bifrost-dot.liebi.com/ws'
    }
  },
  {
    info: 'centrifuge',
    homepage: 'https://centrifuge.io',
    paraId: 2031,
    text: 'Centrifuge',
    providers: {
      Centrifuge: 'wss://fullnode.parachain.centrifuge.io',
      OnFinality: 'wss://centrifuge-parachain.api.onfinality.io/public-ws'
    }
  },
  {
    info: 'clover',
    homepage: 'https://clover.finance',
    paraId: 2002,
    text: 'Clover',
    providers: {
      Clover: 'wss://rpc-para.clover.finance',
      OnFinality: 'wss://clover.api.onfinality.io/public-ws'
    }
  },
  {
    // this is also a duplicate as a Live and Testing network -
    // it is either/or, not and
    info: 'coinversation',
    isUnreachable: true, // https://github.com/polkadot-js/apps/issues/6635
    homepage: 'http://www.coinversation.io/',
    paraId: 2027,
    text: 'Coinversation',
    providers: {
      Coinversation: 'wss://rpc.coinversation.io/'
    }
  },
  {
    info: 'composableFinance',
    isUnreachable: true, // https://github.com/polkadot-js/apps/issues/6721
    homepage: 'https://composable.finance/',
    paraId: 2019,
    text: 'Composable Finance',
    providers: {
      Composable: 'wss://rpc.composable.finance',
      Dwellir: 'wss://composable-rpc.dwellir.com'
    }
  },
  {
    info: 'crustParachain',
    homepage: 'https://crust.network',
    paraId: 2008,
    isUnreachable: true,
    text: 'Crust',
    providers: {
      Crust: 'wss://rpc.crust.network'
    }
  },
  {
    info: 'darwinia',
    isUnreachable: true, // https://github.com/polkadot-js/apps/issues/6530
    homepage: 'https://darwinia.network/',
    paraId: 2003,
    text: 'Darwinia',
    providers: {
      Darwinia: 'wss://parachain-rpc.darwinia.network'
    }
  },
  {
    info: 'efinity',
    homepage: 'https://efinity.io',
    paraId: 2021,
    text: 'Efinity',
    providers: {
      Efinity: 'wss://rpc.efinity.io'
    }
  },
  {
    info: 'equilibrium',
    homepage: 'https://equilibrium.io/',
    paraId: 2011,
    text: 'Equilibrium',
    providers: {
      Equilibrium: 'wss://node.pol.equilibrium.io/'
    }
  },
  {
    info: 'geminis',
    isUnreachable: true,
    homepage: 'https://geminis.network/',
    paraId: 2038,
    text: 'Geminis',
    providers: {
      Geminis: 'wss://rpc.geminis.network'
    }
  },
  {
    info: 'hydra',
    homepage: 'https://hydradx.io/',
    paraId: 2034,
    text: 'HydraDX',
    providers: {
      'Galactic Council': 'wss://rpc-01.hydradx.io'
    }
  },
  {
    info: 'interlay',
    homepage: 'https://interlay.io/',
    paraId: 2032,
    text: 'Interlay',
    providers: {
      'Kintsugi Labs': 'wss://api.interlay.io/parachain',
      OnFinality: 'wss://interlay.api.onfinality.io/public-ws'
    }
  },
  {
    info: 'kapex',
    homepage: 'https://totemaccounting.com/',
    paraId: 2007,
    text: 'Kapex',
    providers: {
      Totem: 'wss://k-ui.kapex.network'
    }
  },
  {
    info: 'litentry',
    homepage: 'https://crowdloan.litentry.com',
    paraId: 2013,
    isUnreachable: true,
    text: 'Litentry',
    providers: {
      Litentry: 'wss://parachain.litentry.io'
    }
  },
  {
    info: 'manta',
    isUnreachable: true, // https://github.com/polkadot-js/apps/issues/7018
    homepage: 'https://manta.network',
    paraId: 2015,
    text: 'Manta',
    providers: {
      // 'Manta Kuhlii': 'wss://kuhlii.manta.systems', // https://github.com/polkadot-js/apps/issues/6930
      // 'Manta Munkiana': 'wss://munkiana.manta.systems', // https://github.com/polkadot-js/apps/issues/6871
      // 'Manta Pectinata': 'wss://pectinata.manta.systems' // https://github.com/polkadot-js/apps/issues/7018
    }
  },
  {
    info: 'moonbeam',
    homepage: 'https://moonbeam.network/networks/moonbeam/',
    paraId: 2004,
    text: 'Moonbeam',
    providers: {
      'Moonbeam Foundation': 'wss://wss.api.moonbeam.network',
      OnFinality: 'wss://moonbeam.api.onfinality.io/public-ws',
      Dwellir: 'wss://moonbeam-rpc.dwellir.com'
    }
  },
  {
    info: 'nodle',
    homepage: 'https://nodle.com',
    paraId: 2026,
    text: 'Nodle',
    providers: {
      OnFinality: 'wss://nodle-parachain.api.onfinality.io/public-ws',
      Dwellir: 'wss://eden-rpc.dwellir.com'
    }
  },
  {
    info: 'origintrail-parachain',
    homepage: 'https://parachain.origintrail.io',
    isUnreachable: true,
    text: 'OriginTrail Parachain',
    paraId: 2043,
    providers: {
      TraceLabs: 'wss://parachain-rpc.origin-trail.network'
    }
  },
  {
    info: 'parallel',
    homepage: 'https://parallel.fi',
    paraId: 2012,
    text: 'Parallel',
    providers: {
      OnFinality: 'wss://parallel.api.onfinality.io/public-ws',
      Parallel: 'wss://rpc.parallel.fi'
    }
  },
  {
    info: 'phala',
    homepage: 'https://phala.network',
    paraId: 2035,
    text: 'Phala Network',
    providers: {
      Phala: 'wss://api.phala.network/ws'
    }
  },
  {
    info: 'polkadex',
    homepage: 'https://polkadex.trade/',
    paraId: 2040,
    text: 'Polkadex',
    providers: {
      'Polkadex Team': 'wss://mainnet.polkadex.trade/',
      OnFinality: 'wss://polkadex.api.onfinality.io/public-ws'
    }
  },
  {
    info: 'subdao',
    homepage: 'https://subdao.network/',
    paraId: 2018,
    isUnreachable: true,
    text: 'SubDAO',
    providers: {
      SubDAO: 'wss://parachain-rpc.subdao.org'
    }
  },
  {
    info: 'subgame',
    homepage: 'http://subgame.org/',
    isUnreachable: true, // https://github.com/polkadot-js/apps/pull/6761
    paraId: 2017,
    text: 'SubGame Gamma',
    providers: {
      SubGame: 'wss://gamma.subgame.org/'
    }
  },
  {
    info: 'unique',
    homepage: 'https://unique.network/',
    paraId: 2037,
    text: 'Unique Network',
    providers: {
      Unique: 'wss://ws.unique.network/'
    }
  }
];

export const prodParasPolkadotCommon: EndpointOption[] = [
  {
    info: 'statemint',
    paraId: 1000,
    text: 'Statemint',
    providers: {
      Parity: 'wss://statemint-rpc.polkadot.io',
      OnFinality: 'wss://statemint.api.onfinality.io/public-ws',
      Dwellir: 'wss://statemint-rpc.dwellir.com'
    }
  }
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function createPolkadot (t: TFunction): EndpointOption {
  return {
    dnslink: 'polkadot',
    genesisHash: POLKADOT_GENESIS,
    info: 'polkadot',
    text: 'Polkadot',
    providers: {
      Parity: 'wss://rpc.polkadot.io',
      OnFinality: 'wss://polkadot.api.onfinality.io/public-ws',
      // 'Geometry Labs': 'wss://polkadot.geometry.io/websockets', // https://github.com/polkadot-js/apps/pull/6746
      Dwellir: 'wss://polkadot-rpc.dwellir.com',
      'light client': 'light://substrate-connect/polkadot'
      // Pinknode: 'wss://rpc.pinknode.io/polkadot/explorer' // https://github.com/polkadot-js/apps/issues/5721
    },
    linked: [
      ...prodParasPolkadotCommon,
      ...prodParasPolkadot
    ]
  };
}
