// Copyright 2017-2023 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as snap from 'azero-wallet-adapter';
import { getSnapId } from 'azero-wallet-adapter';

import { keyring } from '@polkadot/ui-keyring';
import { settings } from '@polkadot/ui-settings';

const rpcUrlMapper: Record<string, string> = {
  'wss://ws.azero.dev': 'https://rpc.azero.dev/',
  'wss://ws.test.azero.dev': 'https://test.rpc.azero.dev/'
};

export const connectSnap = async (): Promise<void> => {
  try {
    const rpcUrl = rpcUrlMapper[settings.apiUrl];

    if (!rpcUrl) {
      console.error(`No RPC URL found for ${settings.apiUrl}`);

      return;
    }

    await snap.connect(getSnapId(), { version: '^0.3.0' });

    await snap.setRpcUrl({ rpcUrl });

    const accountResult = await snap.getAccount();

    if (!accountResult.success) {
      console.error(accountResult.error);

      return;
    }

    const { address } = accountResult.data;

    keyring.addExternal(address, { isSnap: true });
    console.log('Added MetaMask snap account: ', address);
  } catch (e) {
    console.error(e);
  }
};
