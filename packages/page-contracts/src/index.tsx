// Copyright 2017-2023 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

<<<<<<< HEAD
function ContractsApp () {
  // The contracts page has been moved to the external one
  return null;
=======
import React, { useRef } from 'react';

import { Tabs } from '@polkadot/react-components';

import Contracts from './Contracts/index.js';
import { useTranslation } from './translate.js';

function ContractsApp ({ basePath, className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'contracts',
      text: t<string>('Contracts')
    }
  ]);

  return (
    <main className={`${className} contracts--App`}>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      <Contracts />
    </main>
  );
>>>>>>> polkadot-js/master
}

export default React.memo(ContractsApp);
