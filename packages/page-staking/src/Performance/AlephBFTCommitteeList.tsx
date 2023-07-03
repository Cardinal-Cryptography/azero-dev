// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { AddressSmall, Table } from '@polkadot/react-components';
import { useAlephBFTCommittee } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';

type Props = {
  session: number;
};

const AlephBFTCommitteeList = ({ session }: Props) => {
  const { t } = useTranslation();

  const committeeAddresses = useAlephBFTCommittee(session);

  const header: [string][] = [
    [t('Finality committee')]
  ];

  const messageOnEmpty = committeeAddresses && t("Data isn't available that far back.");

  return (
    <Table
      empty={messageOnEmpty}
      header={header}
    >
      {committeeAddresses?.map((address) => (
        <tr key={address}>
          <td><AddressSmall value={address} /></td>
        </tr>
      ))}
    </Table>
  );
};

export default AlephBFTCommitteeList;
