// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

<<<<<<< HEAD
import type { DeriveHeartbeats } from '@polkadot/api-derive/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { NominatedByMap, SortedTargets, ValidatorInfo } from '../types';
=======
import type { DeriveHeartbeats, DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { NominatedByMap, SortedTargets, ValidatorInfo } from '../types.js';
>>>>>>> polkadot-js/master

import React, { useMemo, useRef, useState } from 'react';

import { Table } from '@polkadot/react-components';
<<<<<<< HEAD
import { useLoadingDelay } from '@polkadot/react-hooks';

import Filtering from '../Filtering';
import { useTranslation } from '../translate';
import Address from './Address';
=======
import { useApi, useBlockAuthors, useNextTick } from '@polkadot/react-hooks';

import Filtering from '../Filtering.js';
import Legend from '../Legend.js';
import { useTranslation } from '../translate.js';
import Address from './Address/index.js';
>>>>>>> polkadot-js/master

interface Props {
  className?: string;
  byAuthor: Record<string, string>;
  eraPoints: Record<string, string>;
  favorites: string[];
  hasQueries: boolean;
  isIntentionsTrigger?: boolean;
  isOwn: boolean;
  nominatedBy?: NominatedByMap;
  ownStashIds?: string[];
<<<<<<< HEAD
=======
  paraValidators: Record<string, boolean>;
>>>>>>> polkadot-js/master
  recentlyOnline?: DeriveHeartbeats;
  setNominators?: (nominators: string[]) => void;
  targets: SortedTargets;
  toggleFavorite: (address: string) => void;
}

type AccountExtend = [string, boolean];

interface Filtered {
  validators?: AccountExtend[];
}

<<<<<<< HEAD
function filterAccounts (isOwn: boolean, accounts: string[] = [], ownStashIds: string[] = [], favorites: string[], without: string[]): AccountExtend[] {
=======
function filterAccounts (isOwn: boolean, accounts: string[] = [], ownStashIds: string[] = [], elected: string[], favorites: string[], without: string[]): AccountExtend[] {
>>>>>>> polkadot-js/master
  return accounts
    .filter((accountId) =>
      !without.includes(accountId) && (
        !isOwn ||
        ownStashIds.includes(accountId)
      )
    )
    .map((accountId): AccountExtend => [
      accountId,
      favorites.includes(accountId)
    ])
    .sort(([accA, isFavA]: AccountExtend, [accB, isFavB]: AccountExtend): number => {
      const isStashA = ownStashIds.includes(accA);
      const isStashB = ownStashIds.includes(accB);

      return isFavA === isFavB
        ? isStashA === isStashB
          ? 0
          : (isStashA ? -1 : 1)
        : (isFavA ? -1 : 1);
    });
}

function accountsToString (accounts: AccountId[]): string[] {
  const result = new Array<string>(accounts.length);

  for (let i = 0; i < accounts.length; i++) {
    result[i] = accounts[i].toString();
  }

  return result;
}

function getFiltered (isOwn: boolean, favorites: string[], targets: SortedTargets, ownStashIds?: string[]): Filtered {
  if (!targets.eraValidators) {
    return {};
  }

  const eraValidators = accountsToString(targets.eraValidators.reserved.concat(targets.eraValidators.nonReserved));

  return {
    validators: filterAccounts(isOwn, eraValidators, ownStashIds, favorites, [])
  };
}

function mapValidators (infos: ValidatorInfo[]): Record<string, ValidatorInfo> {
  const result: Record<string, ValidatorInfo> = {};

  for (let i = 0; i < infos.length; i++) {
    const info = infos[i];

    result[info.key] = info;
  }

  return result;
}

function CurrentList ({ className, favorites, hasQueries, isOwn, nominatedBy, ownStashIds, recentlyOnline, targets, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
<<<<<<< HEAD
=======
  const { api } = useApi();
  const { byAuthor, eraPoints } = useBlockAuthors();
>>>>>>> polkadot-js/master
  const [nameFilter, setNameFilter] = useState<string>('');
  const isNextTick = useNextTick();

  const { validators } = useMemo(
    () => getFiltered(isOwn, favorites, targets, ownStashIds),
    [favorites, isOwn, ownStashIds, targets]
  );

  const list = useMemo(
<<<<<<< HEAD
    () => isLoading
      ? undefined
      : nominatedBy && validators,
    [isLoading, nominatedBy, validators]
=======
    () => isNextTick
      ? isIntentions
        ? nominatedBy && waiting
        : validators
      : undefined,
    [isIntentions, isNextTick, nominatedBy, validators, waiting]
>>>>>>> polkadot-js/master
  );

  const infoMap = useMemo(
    () => targets.validators && mapValidators(targets.validators),
    [targets]
  );

<<<<<<< HEAD
  const headerRef = useRef(
    [
      [t('validators'), 'start', 2],
      [t('other stake'), 'expand'],
      [t('own stake'), 'media--1100'],
      [t('nominators'), 'expand'],
      [t('commission')],
      [],
      [undefined, 'media--1200']
    ]
=======
  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>(
    isIntentions
      ? [
        [t<string>('intentions'), 'start', 3],
        [t<string>('nominators'), 'expand'],
        [t<string>('commission'), 'number'],
        []
      ]
      : [
        [t<string>('validators'), 'start', 3],
        [t<string>('other stake'), 'expand'],
        [t<string>('commission')],
        [t<string>('last #')],
        []
      ]
>>>>>>> polkadot-js/master
  );

  return (
    <Table
      className={className}
      empty={
        list && recentlyOnline && infoMap && t<string>('No active validators found')
      }
      emptySpinner={
        <>
          {!infoMap && <div>{t<string>('Retrieving validator info')}</div>}
          {!nominatedBy && <div>{t<string>('Retrieving nominators')}</div>}
          {!list && <div>{t<string>('Preparing validator list')}</div>}
        </>
      }
      filter={
        <Filtering
          nameFilter={nameFilter}
          setNameFilter={setNameFilter}
        />
      }
      header={headerRef.current}
    >
      {list && list.map(([address, isFavorite]): React.ReactNode => (
        <Address
          address={address}
          filterName={nameFilter}
          hasQueries={hasQueries}
          isFavorite={isFavorite}
<<<<<<< HEAD
=======
          isMain={!isIntentions}
          isPara={paraValidators[address]}
>>>>>>> polkadot-js/master
          key={address}
          nominatedBy={nominatedBy?.[address]}
          toggleFavorite={toggleFavorite}
          validatorInfo={infoMap?.[address]}
        />
      ))}
    </Table>
  );
}

export default React.memo(CurrentList);
