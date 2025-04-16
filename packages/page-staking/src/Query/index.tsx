// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionIndex } from '@polkadot/types/interfaces';
import type { INumber } from '@polkadot/types/types';
import type { FutureCommittee } from '../Performance/useFutureSessionCommittee.js';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getCommitteeManagement } from '@polkadot/react-api/getCommitteeManagement';
import { Button, CardSummary, InputAddressSimple, Spinner, styled, SummaryBox, Table, ToggleGroup } from '@polkadot/react-components';
import { useApi, useCall, useNextTick } from '@polkadot/react-hooks';

import useFutureSessionCommittee from '../Performance/useFutureSessionCommittee.js';
import useSessionInfo from '../Performance/useSessionInfo.js';
import ProducerPerformance from '../react-components/ProducerPerformance/index.js';
import { useTranslation } from '../translate.js';
import ValidatorHistoricPerformance from './AlephCommitttee/ValidatorHistoricPerformance.js';
import { range } from './util.js';
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
  const { t } = useTranslation();
  const { api } = useApi();
  const { value } = useParams<{ value: string }>();
  const [validatorId, setValidatorId] = useState<string | null>(value || null);
  const underperformedValidatorSessionCount = useCall<SessionIndex>(
    getCommitteeManagement(api).query.underperformedValidatorSessionCount,
    [value]
  );

  const sessionInfo = useSessionInfo();
  const isNextTick = useNextTick();

  const groups = [
    { text: t('Past performance'), value: 'past' },
    { text: t('Future committees'), value: 'future' }
  ];
  const [groupIndex, setGroupIndex] = useState(1);

  const isAlephChain = useMemo(() => {
    return api.runtimeChain.toString().includes('Aleph Zero');
  }, [api]
  );

  const futureSessions = useMemo(() => {
    if (sessionInfo) {
      if (sessionInfo.currentSession < sessionInfo.maximumSessionNumber) {
        return range(sessionInfo.maximumSessionNumber - sessionInfo.currentSession, sessionInfo.currentSession + 1);
      }
    }

    return [];
  }, [sessionInfo]);

  const eras = useCall<INumber[]>(api.derive.staking.erasHistoric);

  const labels = useMemo(
    () => eras?.map((e) => e.toHuman() as string),
    [eras]
  );

  const _onQuery = useCallback(
    () => doQuery(validatorId),
    [validatorId]
  );

  const futureSessionCommittee = useFutureSessionCommittee(futureSessions);
  const filteredSessionCommittee: FutureCommittee[] = useMemo(() => {
    if (value) {
      return futureSessionCommittee.filter((committee) => committee !== undefined && committee.producers.includes(value));
    }

    return [];
  }, [futureSessionCommittee, value]);

  const futureSessionsList: FutureCommittee[] = useMemo(
    () => isNextTick
      ? filteredSessionCommittee
      : [],
    [isNextTick, filteredSessionCommittee]
  );

  const headerRefFutureCommittee = useRef<[string, string, number?][]>(
    [
      [t('future committee sessions'), 'start', 1],
      [t('session'), 'expand'],
      [t('blocks created'), 'expand'],
      [t('max % reward'), 'expand']
    ]
  );

  if (!labels) {
    return <Spinner />;
  }

  return (
    <div className={className}>
      <InputAddressSimple
        className='staking--queryInput'
        defaultValue={value}
        label={t('validator to query')}
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
        <StyledToggleGroup
          onChange={setGroupIndex}
          options={groups}
          value={groupIndex}
        />
      }
      {value && !!isAlephChain && groupIndex === 0 &&
      <SummaryBox className={className}>
        <CardSummary
          label={t('Underperformed Production Session Count')}
        >
          {underperformedValidatorSessionCount?.toString()}
        </CardSummary>
      </SummaryBox>
      }
      {value && !!isAlephChain && groupIndex === 0 &&
        <ValidatorHistoricPerformance
          address={value}
        />
      }
      {value && !!isAlephChain && groupIndex === 1 &&
        <Table
          className={className}
          empty={filteredSessionCommittee.length === futureSessions.length && <div>{t('No entries found')}</div>}
          emptySpinner={
            <>
              {(filteredSessionCommittee.length !== futureSessions.length) && <div>{t('Querying future sessions')}</div>}
            </>
          }
          header={headerRefFutureCommittee.current}
        >
          {futureSessionsList?.map((committee): React.ReactNode => (
            <ProducerPerformance
              address={value}
              blocksCreated={0}
              filterName={''}
              key={committee.session}
              rewardPercentage={'0.0'}
              session={committee.session}
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

const StyledToggleGroup = styled(ToggleGroup)`
  display: block;
  margin-top: 3rem;
  margin-bottom: 1.5rem;
`;
