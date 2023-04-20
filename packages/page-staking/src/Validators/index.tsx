// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveHeartbeats, DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { StakerState } from '@polkadot/react-hooks/types';
<<<<<<< HEAD
import type { NominatedByMap, SortedTargets } from '../types';
=======
import type { BN } from '@polkadot/util';
import type { NominatedByMap, SortedTargets } from '../types.js';
>>>>>>> polkadot-js/master

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Button, ToggleGroup } from '@polkadot/react-components';
import { useApi, useBlockAuthors, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import ActionsBanner from './ActionsBanner.js';
import CurrentList from './CurrentList.js';
import Summary from './Summary.js';

interface Props {
  className?: string;
  favorites: string[];
  hasAccounts: boolean;
  hasQueries: boolean;
  nominatedBy?: NominatedByMap;
  ownStashes?: StakerState[];
  stakingOverview?: DeriveStakingOverview;
  targets: SortedTargets;
  toggleFavorite: (address: string) => void;
  toggleLedger?: () => void;
  toggleNominatedBy: () => void;
}

<<<<<<< HEAD
function Overview ({ className = '', favorites, hasAccounts, hasQueries, nominatedBy, ownStashes, stakingOverview, targets, toggleFavorite, toggleLedger, toggleNominatedBy }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
=======
const EMPTY_PARA_VALS: Record<string, boolean> = {};
const EMPTY_BY_AUTHOR: Record<string, string> = {};
const EMPTY_ERA_POINTS: Record<string, string> = {};

function Overview ({ className = '', favorites, hasAccounts, hasQueries, minCommission, nominatedBy, ownStashes, paraValidators, stakingOverview, targets, toggleFavorite, toggleLedger, toggleNominatedBy }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { byAuthor, eraPoints } = useBlockAuthors();
  const [intentIndex, _setIntentIndex] = useState(0);
>>>>>>> polkadot-js/master
  const [typeIndex, setTypeIndex] = useState(1);
  const recentlyOnline = useCall<DeriveHeartbeats>(api.derive.imOnline?.receivedHeartbeats);

  const filterOptions = useRef([
    { text: t<string>('Own validators'), value: 'mine' },
    { text: t<string>('All validators'), value: 'all' }
  ]);

<<<<<<< HEAD
=======
  const intentOptions = useRef([
    { text: t<string>('Active'), value: 'active' },
    { text: t<string>('Waiting'), value: 'waiting' }
  ]);

>>>>>>> polkadot-js/master
  const ownStashIds = useMemo(
    () => ownStashes && ownStashes.map(({ stashId }) => stashId),
    [ownStashes]
  );

  useEffect((): void => {
    toggleNominatedBy && toggleNominatedBy();
  }, [toggleNominatedBy]);

  useEffect((): void => {
    toggleLedger && toggleLedger();
  }, [toggleLedger]);

  const isOwn = typeIndex === 0;

  return (
    <div className={`${className} staking--Overview`}>
      <Summary
        eraValidators={targets.eraValidators}
        stakingOverview={stakingOverview}
        targets={targets}
      />
      {hasAccounts && (ownStashes?.length === 0) && (
        <ActionsBanner />
      )}
      <Button.Group>
        <ToggleGroup
          onChange={setTypeIndex}
          options={filterOptions.current}
          value={typeIndex}
        />
      </Button.Group>
      <CurrentList
        byAuthor={intentIndex === 0 ? byAuthor : EMPTY_BY_AUTHOR}
        eraPoints={intentIndex === 0 ? eraPoints : EMPTY_ERA_POINTS}
        favorites={favorites}
        hasQueries={hasQueries}
        isOwn={isOwn}
        key={0}
        nominatedBy={nominatedBy}
        ownStashIds={ownStashIds}
<<<<<<< HEAD
        recentlyOnline={recentlyOnline}
=======
        paraValidators={(intentIndex === 0 && paraValidators) || EMPTY_PARA_VALS}
        recentlyOnline={intentIndex === 0 ? recentlyOnline : undefined}
        stakingOverview={stakingOverview}
>>>>>>> polkadot-js/master
        targets={targets}
        toggleFavorite={toggleFavorite}
      />
    </div>
  );
}

export default React.memo(Overview);
