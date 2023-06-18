// Copyright 2017-2023 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as snap from 'azero-wallet-adapter';

import { keyring } from '@polkadot/ui-keyring';

export const connectSnap = async () => {
  try {
    const isFlask = await snap.isFlask();

    if (!isFlask) {
      console.warn('No MetaMask Flask detected');

      return;
    }

    const isInstalled = await snap.isInstalled();

    if (!isInstalled) {
      await snap.connect();
    }

    const account = await snap.getAccount();

    // TODO: Do we need to do this before `addExternal`?
    // if (!keyring.getAccount()) {
    //   keyring.loadAll({});
    // }

    keyring.addExternal(account, { isSnap: true });
    console.log('Added snap account', account);
  } catch (e) {
    console.error(e);
  }
};
