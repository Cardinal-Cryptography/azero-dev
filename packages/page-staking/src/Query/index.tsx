// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

<<<<<<< HEAD
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import Address from '@polkadot/app-staking/Performance/Address';
import { calculatePercentReward } from '@polkadot/app-staking/Performance/CurrentList';
import useSessionCommitteePerformance, { ValidatorPerformance } from '@polkadot/app-staking/Performance/useCommitteePerformance';
import useCurrentSessionInfo from '@polkadot/app-staking/Performance/useCurrentSessionInfo';
import { Button, CardSummary, InputAddressSimple, SummaryBox, Table } from '@polkadot/react-components';
import { useApi, useCall, useLoadingDelay } from '@polkadot/react-hooks';
import { u32 } from '@polkadot/types-codec';
=======
import type { INumber } from '@polkadot/types/types';

import React, { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Button, InputAddressSimple, Spinner } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
>>>>>>> polkadot-js/master

import { useTranslation } from '../translate.js';
import Validator from './Validator.js';

interface Props {
  className?: string;
}

function doQuery (validatorId?: string | null): void {
  if (validatorId) {
    window.location.hash = `/staking/query/${validatorId}`;
  }
}

function Query ({ className }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { t } = useTranslation();
  const { api } = useApi();
  const { value } = useParams<{ value: string }>();
  const [validatorId, setValidatorId] = useState<string | null>(value || null);
<<<<<<< HEAD
  const underperformedValidatorSessionCount = useCall<u32>(api.query.elections.underperformedValidatorSessionCount, [value]);

  const [currentSession, currentEra, historyDepth, minimumSessionNumber] = useCurrentSessionInfo();
  const isLoading = useLoadingDelay();

  function range (size: number, startAt = 0) {
    return [...Array(size).keys()].map((i) => i + startAt);
  }

  const isAlephChain = useMemo(() => {
    return api.runtimeChain.toString().includes('Aleph Zero');
  }, [api]
  );

  const pastSessions = useMemo(() => {
    if (currentSession && currentEra && historyDepth && minimumSessionNumber) {
      const maxSessionQueryDepth = 4 * historyDepth;
      const minSessionNumber = Math.max(minimumSessionNumber, currentSession - maxSessionQueryDepth);
      const queryDepth = currentSession - minSessionNumber;

      return range(queryDepth, currentSession - queryDepth);
    }

    return [];
  }, [currentSession, currentEra, historyDepth, minimumSessionNumber]
  );

  const sessionCommitteePerformance = useSessionCommitteePerformance(pastSessions);

  const filteredSessionPerformances = useMemo(() => {
    return sessionCommitteePerformance.map(({ isPalletElectionsSupported, performance, sessionId }) => {
      return isPalletElectionsSupported
        ? performance.filter((performance) => performance.accountId === value).map((performance) => {
          return [performance, sessionId, value];
        })
        : [];
    }).flat();
  },
  [sessionCommitteePerformance, value]);

  const numberOfNonZeroPerformances = useMemo(() => {
    return sessionCommitteePerformance.filter(({ performance }) =>
      performance.length).length;
  },
  [sessionCommitteePerformance]);

  const list = useMemo(
    () => isLoading
      ? []
      : filteredSessionPerformances,
    [isLoading, filteredSessionPerformances]
=======
  const eras = useCall<INumber[]>(api.derive.staking.erasHistoric);

  const labels = useMemo(
    () => eras && eras.map((e) => e.toHuman() as string),
    [eras]
>>>>>>> polkadot-js/master
  );

  const _onQuery = useCallback(
    () => doQuery(validatorId),
    [validatorId]
  );

<<<<<<< HEAD
  const headerRef = useRef(
    [
      [t('session performance in last 4 eras'), 'start', 1],
      [t('session'), 'expand'],
      [t('blocks created'), 'expand'],
      [t('blocks expected'), 'expand'],
      [t('max % reward'), 'expand']
    ]
  );
=======
  if (!labels) {
    return <Spinner />;
  }
>>>>>>> polkadot-js/master

  return (
    <div className={className}>
      <InputAddressSimple
        className='staking--queryInput'
        defaultValue={value}
        label={t<string>('validator to query')}
        onChange={setValidatorId}
        onEnter={_onQuery}
      >
        <Button
          icon='play'
          isDisabled={!validatorId}
          onClick={_onQuery}
        />
      </InputAddressSimple>
      {value && !!isAlephChain &&
      <SummaryBox className={className}>

        <CardSummary label={t<string>('Underperformed Session Count')}>
          {underperformedValidatorSessionCount?.toString()}
        </CardSummary>
      </SummaryBox>
      }
      {value && !!isAlephChain &&
      <Table
        className={className}
        empty={numberOfNonZeroPerformances === pastSessions.length && <div>{t<string>('No entries found')}</div>}
        emptySpinner={
          <>
            {(numberOfNonZeroPerformances !== pastSessions.length) && <div>{t<string>('Querying past performances')}</div>}
          </>
        }
        header={headerRef.current}
      >
        {list && list.map((performance): React.ReactNode => (
          <Address
            address={(performance[0] as ValidatorPerformance).accountId}
            blocksCreated={(performance[0] as ValidatorPerformance).blockCount}
            blocksTarget={(performance[0] as ValidatorPerformance).expectedBlockCount}
            filterName={''}
            key={performance[1] as number}
            rewardPercentage={calculatePercentReward((performance[0] as ValidatorPerformance).blockCount, (performance[0] as ValidatorPerformance).expectedBlockCount)}
            session={performance[1] as number}
          />
        ))}
      </Table>}
      {value && (
        <Validator
          labels={labels}
          validatorId={value}
        />
      )}
    </div>
  );
}

export default React.memo(Query);
