// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { MarkWarning } from '@polkadot/react-components';

import { useTranslation } from '../translate';

function ActionsBanner (): React.ReactElement<null> | null {
  const { t } = useTranslation();

  let aleph_zero_staking_homepage = "https://alephzero.org/staking";
  return (
    <MarkWarning
      className='warning centered'
      content={<>
        {t<string>('Use the account actions to create a new validator/nominator stash and bond it to participate in staking. Do not send funds directly via a transfer to a validator. Learn more about the staking process ')}
        {<a
            href={aleph_zero_staking_homepage}
            rel='noopener noreferrer'
            target='_blank'
        >{t<string>('here.')}</a>}
      </>}
    />
  );
}

export default React.memo(ActionsBanner);
