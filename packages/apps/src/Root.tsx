// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeDef } from '@polkadot/react-components/types';
import type { KeyringStore } from '@polkadot/ui-keyring/types';

import React, { Suspense, useEffect, useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { Api } from '@polkadot/react-api';
import Queue from '@polkadot/react-components/Status/Queue';
import { BlockAuthors, Events } from '@polkadot/react-query';
import { settings } from '@polkadot/ui-settings';

import Apps from './Apps';
import { darkTheme, lightTheme } from './themes';
import WindowDimensions from './WindowDimensions';

interface Props {
  store?: KeyringStore;
}

function createTheme ({ uiTheme }: { uiTheme: string }): ThemeDef {
  const validTheme = uiTheme === 'light' ? 'light' : 'dark';

  document && document.documentElement &&
    document.documentElement.setAttribute('data-theme', validTheme);

  return uiTheme === 'light'
    ? lightTheme
    : darkTheme;
}

function Root ({ store }: Props): React.ReactElement<Props> {
  const [theme, setTheme] = useState(() => createTheme(settings));

  useEffect((): void => {
    settings.on('change', (settings) => setTheme(createTheme(settings)));
  }, []);

  return (
    <Suspense fallback='...'>
      <ThemeProvider theme={theme}>
        <Queue>
          <Api
            apiUrl={settings.apiUrl}
            store={store}
          >
            <BlockAuthors>
              <Events>
                <HashRouter>
                  <WindowDimensions>
                    <Apps />
                  </WindowDimensions>
                </HashRouter>
              </Events>
            </BlockAuthors>
          </Api>
        </Queue>
      </ThemeProvider>
    </Suspense>
  );
}

export default React.memo(Root);
