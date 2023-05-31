// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BareProps as Props } from '@polkadot/react-components/types';

import * as snap from 'azero-snap-adapter';
import React, { useEffect, useMemo, useState } from 'react';

import AccountSidebar from '@polkadot/app-accounts/Sidebar';
import { styled } from '@polkadot/react-components/styled';
import GlobalStyle from '@polkadot/react-components/styles';
import { useApi, useTheme } from '@polkadot/react-hooks';
import Signer from '@polkadot/react-signer';
import { keyring } from '@polkadot/ui-keyring';

import Content from './Content/index.js';
import Menu from './Menu/index.js';
import ConnectingOverlay from './overlays/Connecting.js';
import DotAppsOverlay from './overlays/DotApps.js';
import WarmUp from './WarmUp.js';

export const PORTAL_ID = 'portals';

function Apps ({ className = '' }: Props): React.ReactElement<Props> {
  const { themeClassName } = useTheme();
  const { apiEndpoint, isDevelopment } = useApi();

  const [snapConnected, setSnapConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [seed, setSeed] = useState('');

  const doConnectSnap = async () => {
    try {
      await snap.connect();
      const accounts = await snap.getAccounts();
      // TODO: Currently there is just one account in snap
      const account = accounts[0];

      // if (accounts.length < 1) {
      //   if (seed === '') {
      //     const account = await snap.generateNewAccount();
      //
      //     keyring.addExternal(account.address);
      //   } else {
      //     const account = await snap.getAccountFromSeed(seed);
      //
      //     keyring.addExternal(account.address);
      //   }
      // }

      console.log({ accounts });

      keyring.addExternal(account);
      console.log({ keyringAccounts: keyring.getAccounts() });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const connectSnap = async () => {
      setLoading(true);
      setSnapConnected(false);

      await doConnectSnap();

      setSnapConnected(true);
      setLoading(false);
    };

    connectSnap().catch(console.error);
  }, []);

  const uiHighlight = useMemo(
    () => isDevelopment
      ? undefined
      : apiEndpoint?.ui.color,
    [apiEndpoint, isDevelopment]
  );

  return (
    <>
      {!snapConnected && (
        <>
          <h1>Connect and install snap</h1>
          <p>
            New Aleph Zero account will be automatically created from your MetaMask private key.
          </p>
          <p>
            Please take a not of snap permission, that you will be asked for.
          </p>
          <p>
            Note: We recommend using a throw-away MetaMask account.
          </p>
          <p>
            This demo uses MetaMask flask (canary release). In order to use it, please follow installation instructions
            in readme: https://github.com/piotr-roslaniec/ethwarsaw-2022/tree/docs#installing-metamask-flask.
          </p>
          {loading && <p>Loading...</p>}
          {!loading &&
            <div>
              <div>
                <input
                  height={'40px'}
                  onChange={(e) => setSeed(e.target.value)}
                  placeholder={'seed in hex (optional)'}
                ></input>
              </div>
              <div>
                <button
                  disabled={snapConnected}
                  onClick={doConnectSnap}
                >
                  Create account
                </button>
              </div>
            </div>}
        </>
      )}
      {snapConnected && (
        <>
          <GlobalStyle uiHighlight={uiHighlight} />
          <StyledDiv className={`${className} apps--Wrapper ${themeClassName}`}>
            <Menu />
            <AccountSidebar>
              <Signer>
                <Content />
              </Signer>
              <ConnectingOverlay />
              <DotAppsOverlay />
              <div id={PORTAL_ID} />
            </AccountSidebar>
          </StyledDiv>
          <WarmUp />
        </>
      )}
    </>
  );
}

const StyledDiv = styled.div`
  background: var(--bg-page);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  ${[
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24
  ].map((n) => `
    .greyAnim-${n} {
      animation: greyAnim${n} 2s;
    }

    @keyframes greyAnim${n} {
      0% { background: #a6a6a6; }
      50% { background: darkorange; }
      100% { background: #a6a6a6; }
    }
  `).join('')}
`;

export default React.memo(Apps);
