// Copyright 2017-2024 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Option } from '@polkadot/types';
import type { SlashingSpans, ValidatorPrefs } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { NominatedBy as NominatedByType, ValidatorInfo } from '../../types.js';
import type { NominatorValue } from './types.js';

import React, { useMemo } from 'react';

import { AddressSmall, Columar, Icon, LinkExternal, Table } from '@polkadot/react-components';
import { checkVisibility } from '@polkadot/react-components/util';
import { useAddressToDomain, useApi, useCall, useDeriveAccountInfo, useToggle } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate.js';
import NominatedBy from './NominatedBy.js';
import StakeOther from './StakeOther.js';

interface Props {
  address: string;
  className?: string;
  filterName: string;
  hasQueries: boolean;
  isFavorite: boolean;
  nominatedBy?: NominatedByType[];
  toggleFavorite: (accountId: string) => void;
  validatorInfo?: ValidatorInfo;
  withIdentity?: boolean;
}

interface StakingState {
  commission?: string;
  nominators?: NominatorValue[];
  stakeTotal?: BN;
  stakeOther?: BN;
  stakeOwn?: BN;
}

<<<<<<< HEAD
function expandInfo ({ exposure, validatorPrefs }: ValidatorInfo): StakingState {
  let nominators: NominatorValue[] = [];
||||||| 2b40308a49
function expandInfo ({ exposure, validatorPrefs }: ValidatorInfo, minCommission?: BN): StakingState {
  let nominators: NominatorValue[] | undefined;
=======
function expandInfo ({ exposureMeta, exposurePaged, validatorPrefs }: ValidatorInfo, minCommission?: BN): StakingState {
  let nominators: NominatorValue[] | undefined;
>>>>>>> a0-ops-upstream-automerge
  let stakeTotal: BN | undefined;
  let stakeOther: BN | undefined;
  let stakeOwn: BN | undefined;

  if (exposureMeta?.total) {
    nominators = exposurePaged.others.map(({ value, who }) => ({
      nominatorId: who.toString(),
      value: value.unwrap()
    }));
    stakeTotal = exposureMeta.total?.unwrap() || BN_ZERO;
    stakeOwn = exposureMeta.own.unwrap();
    stakeOther = stakeTotal.sub(stakeOwn);
  }

  const commission = (validatorPrefs as ValidatorPrefs)?.commission?.unwrap();

  return {
    commission: commission?.toHuman(),
    nominators,
    stakeOther,
    stakeOwn,
    stakeTotal
  };
}

const transformSlashes = {
  transform: (opt: Option<SlashingSpans>) => opt.unwrapOr(null)
};

function useAddressCalls (api: ApiPromise, address: string) {
  const params = useMemo(() => [address], [address]);
  const accountInfo = useDeriveAccountInfo(address);
  const slashingSpans = useCall<SlashingSpans | null>(api.query.staking.slashingSpans, params, transformSlashes);

  return { accountInfo, slashingSpans };
}

function Address ({ address, className = '', filterName, hasQueries, isFavorite, nominatedBy, toggleFavorite, validatorInfo, withIdentity }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api, apiIdentity } = useApi();
  const [isExpanded, toggleIsExpanded] = useToggle(false);
  const { accountInfo, slashingSpans } = useAddressCalls(api, address);
  const { primaryDomain: domain } = useAddressToDomain(address);

  const { commission, nominators, stakeOther, stakeOwn } = useMemo(
    () => validatorInfo
      ? expandInfo(validatorInfo)
      : {},
    [validatorInfo]
  );

  const isVisible = useMemo(
<<<<<<< HEAD
    () => accountInfo ? checkVisibility(api, address, { ...accountInfo, domain }, filterName, withIdentity) : true,
    [api, accountInfo, address, domain, filterName, withIdentity]
||||||| 2b40308a49
    () => accountInfo ? checkVisibility(api, address, accountInfo, filterName, withIdentity) : true,
    [api, accountInfo, address, filterName, withIdentity]
=======
    () => accountInfo ? checkVisibility(apiIdentity, address, accountInfo, filterName, withIdentity) : true,
    [accountInfo, address, filterName, apiIdentity, withIdentity]
>>>>>>> a0-ops-upstream-automerge
  );

  const statsLink = useMemo(
    () => `#/staking/query/${address}`,
    [address]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <tr className={`${className} isExpanded isFirst ${isExpanded ? 'packedBottom' : 'isLast'}`}>
        <Table.Column.Favorite
          address={address}
          isFavorite={isFavorite}
          toggle={toggleFavorite}
        />
        <td className='address all relative'>
          <AddressSmall value={address} />
        </td>
        <StakeOther
          nominators={nominators}
          stakeOther={stakeOther}
        />
        <td className='number media--1100'>
          {stakeOwn?.gtn(0) && (
            <FormatBalance value={stakeOwn} />
          )}
        </td>
        <NominatedBy
          nominators={nominatedBy}
          slashingSpans={slashingSpans}
        />
        <td className='number'>
          {commission || <span className='--tmp'>50.00%</span>}
        </td>
        <Table.Column.Expand
          isExpanded={isExpanded}
          toggle={toggleIsExpanded}
        />
      </tr>
      {isExpanded && (
        <tr className={`${className} ${isExpanded ? 'isExpanded isLast' : 'isCollapsed'} packedTop`}>
          <td colSpan={2} />
          <td
            className='columar'
            colSpan={3}
          >
            <Columar size='small'>
              <Columar.Column>
                {hasQueries && (
                  <>
                    <h5>{t('graphs')}</h5>
                    <a href={statsLink}>
                      <Icon
                        className='highlight--color'
                        icon='chart-line'
                      />
                      &nbsp;{t('historic results')}
                    </a>
                  </>
                )}
              </Columar.Column>
            </Columar>
            <Columar is100>
              <Columar.Column>
                <LinkExternal
                  data={address}
                  type='validator' // {isMain ? 'validator' : 'intention'}
                  withTitle
                />
              </Columar.Column>
            </Columar>
          </td>
          <td />
        </tr>
      )}
    </>
  );
}

export default React.memo(Address);
