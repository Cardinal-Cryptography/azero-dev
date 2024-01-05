// Copyright 2017-2023 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as snap from 'azero-wallet-adapter';

import { keyring } from '@polkadot/ui-keyring';

export const connectSnap = async (): Promise<void> => {
  try {
    await snap.connect();

    // TODO: Set the RPC URL based on the current network
    await snap.setRpcUrl({ rpcUrl: 'https://rpc.test.azero.dev/' });

    const accountResult = await snap.getAccount();

    if (!accountResult.success) {
      console.error(accountResult.error);

      return;
    }

    const { address } = accountResult.data;

    keyring.addExternal(address, { isSnap: true });
    console.log('Added snap account', address);
  } catch (e) {
    console.error(e);
  }
};
