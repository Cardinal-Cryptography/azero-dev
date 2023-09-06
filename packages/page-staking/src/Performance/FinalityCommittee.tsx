// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { AddressSmall, CardSummary, SummaryBox, Table } from '@polkadot/react-components';
import { useAlephBFTCommittee } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';

type Props = {
  session: number;
};

function FinalityCommittee ({ session }: Props) {
  const { t } = useTranslation();
  const finalizingCommitteeAddresses = useAlephBFTCommittee(session);

  const messageOnEmpty = finalizingCommitteeAddresses && t("Data isn't available.");

  return (
    <>
      <SummaryBox>
        <section>
          <CardSummary label={t<string>('finality committee size')}>
            <span className={finalizingCommitteeAddresses ? '' : '--tmp'}>
              {finalizingCommitteeAddresses?.length ?? '0'}
            </span>
          </CardSummary>
        </section>
      </SummaryBox>
      <Table empty={messageOnEmpty}>
        {finalizingCommitteeAddresses?.map((address) => (
          <tr key={address}>
            <td><AddressSmall value={address} /></td>
          </tr>
        ))}
      </Table>
    </>
  );
}

export default FinalityCommittee;
