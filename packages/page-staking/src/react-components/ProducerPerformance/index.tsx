// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';

import React, { useCallback, useMemo } from 'react';

import { AddressSmall, Icon, Spinner } from '@polkadot/react-components';
import { checkVisibility } from '@polkadot/react-components/util';
import { useAddressToDomain, useApi, useDeriveAccountInfo } from '@polkadot/react-hooks';

interface Props {
  address: string;
  filterName: string;
  rewardPercentage: string,
  blocksCreated?: number,
  session?: number;
}

function useAddressCalls (_api: ApiPromise, address: string) {
  const accountInfo = useDeriveAccountInfo(address);

  return { accountInfo };
}

function queryAddress (address: string) {
  window.location.hash = `/staking/query/${address}`;
}

/**
 * A reusable component describing block production performance of a block production committee member.
 * @param address Validator's account id
 * @param blocksCreated How many blocks the validator created in a session; is optional only for better UX experience,
 *                      ie when empty, it means parent component is still calculating data
 * @param filterName a pattern which is used to filter validator, either by account id, domain or identity; can be empty
 * @param rewardPercentage a percent as string, e.g. '100.0%'
 * @param session session number, optional. If specified, additional column is rendered.
 * @constructor
 */
function ProducerPerformance ({ address, blocksCreated, filterName, rewardPercentage, session }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { accountInfo } = useAddressCalls(api, address);
  const { primaryDomain: domain } = useAddressToDomain(address);

  const isVisible = useMemo(
    () => accountInfo ? checkVisibility(api, address, { ...accountInfo, domain }, filterName) : true,
    [api, accountInfo, address, domain, filterName]
  );

  const onQueryStats = useCallback(
    () => queryAddress(address),
    [address]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <tr>
      <td className='address'>
        <AddressSmall value={address} />
      </td>
      {session && <td className='number'>
        {session}
      </td>}
      <td className='number'>
        {blocksCreated ?? <Spinner noLabel={true} />}
      </td>
      <td className='number'>
        {blocksCreated === undefined ? '' : rewardPercentage}
      </td>
      {!session && <td className='number'>
        <Icon
          className='staking--stats highlight--color'
          icon='chart-line'
          onClick={onQueryStats}
        />
      </td>}
    </tr>
  );
}

export default React.memo(ProducerPerformance);
