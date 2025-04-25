// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionIndex } from '@polkadot/types/interfaces';

import React, { useEffect, useMemo, useState } from 'react';
import { GaugeComponent } from 'react-gauge-component';

import { getCommitteeManagement } from '@polkadot/react-api/getCommitteeManagement';
import { CardSummary, Spinner, styled, Table } from '@polkadot/react-components';
import { useApi, useCall, useNextTick } from '@polkadot/react-hooks';

import useAbftScores from '../../Performance/useAbftScores.js';
import useEraSessionBoundaries from '../../Performance/useEraSessionBoundaries.js';
import useSessionInfo from '../../Performance/useSessionInfo.js';
import FinalizerPerformance from '../../react-components/FinalizerPerformance/index.js';
import MinMaxToggleAndText from '../../react-components/MinMaxToggleAndText/index.js';
import { getFinalityCommittee, range } from '../../util.js';

interface Props {
  address: string;
}

function FinalizerHistoricPerformance ({ address }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const sessionInfo = useSessionInfo();

  const isNextTick = useNextTick();

  const [inputEra, setInputEra] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (sessionInfo && !inputEra) {
      setInputEra(sessionInfo.currentEra);
    }
  }, [sessionInfo, inputEra]);

  const eraSessionBoundary = useEraSessionBoundaries({ era: inputEra });

  const pastSessions = useMemo(() => {
    if (eraSessionBoundary) {
      return range(eraSessionBoundary.eraEndSession - eraSessionBoundary.firstSession, eraSessionBoundary.firstSession);
    }

    return [];
  }, [eraSessionBoundary]
  );

  const pastAbftScores = useAbftScores(pastSessions);

  console.log(pastAbftScores);

  const [pastFinalizationCommittees, setPastFinalizationCommittees] = useState<string[][]>([]);

  useEffect(() => {
    Promise.all(pastSessions.map((pastSession) => getFinalityCommittee(pastSession, api)))
      .then((promisesResults) => setPastFinalizationCommittees(promisesResults))
      .catch(console.error);
  }, [pastSessions, api]);
  const dataLoaded = pastSessions.length > 0 &&
    pastSessions.length === pastAbftScores.length &&
    pastSessions.length === pastFinalizationCommittees.length;

  console.log(pastSessions.length, pastFinalizationCommittees.length, pastAbftScores.length);

  const finalizerScores = useMemo(() => {
    if (dataLoaded) {
      return pastSessions.map((session, index) => {
        const pastFinalizationCommittee = pastFinalizationCommittees[index];

        if (pastFinalizationCommittee === undefined) {
          console.error(`Unexpected empty finalization committee for session ${session}`);
        }

        const pastAbftScore = pastAbftScores[index];

        if (pastAbftScore === undefined) {
          console.error(`Unexpected empty abft score for session ${session}`);
        }

        return pastAbftScore.abftScore.map((abftScore) => ({
          abftScore: abftScore.score,
          accountId: pastFinalizationCommittee[abftScore.nodeIndex],
          session
        })
        );
      }).flat().filter((finalizerEntry) => finalizerEntry.accountId === address);
    }

    return [];
  },
  [pastAbftScores, pastFinalizationCommittees, pastSessions, dataLoaded, address]);

  const headerRef: [string, string, number?][] =
    [
      ['finalizers', 'start', 1],
      ['ABFT score', 'expand'],
      ['stats', 'expand']
    ];

  const list = useMemo(
    () => isNextTick
      ? finalizerScores
      : [],
    [isNextTick, finalizerScores]
  );

  const underperformedFinalizerSessionCount = useCall<SessionIndex>(
    getCommitteeManagement(api).query.underperformedFinalizerSessionCount,
    [address]
  );

  if (sessionInfo === undefined ||
    inputEra === undefined) {
    return (
      <Spinner label={'loading data'} />
    );
  }

  return (
    <>
      <section className='minmaxtoggle'>
        <MinMaxToggleAndText
          maxValue={sessionInfo.currentEra}
          minValue={sessionInfo.minimumEraNumber}
          onValueChange={setInputEra}
          selectedValue={inputEra}
          valueString={'era'}
        />
      </section>
      {underperformedFinalizerSessionCount !== undefined && <StyledDiv>
        <CardSummary
          label={'Underperformed Production Session Count'}
        >
          <GaugeComponent
            arc={{
              subArcs: [
                {
                  color: '#5BE12C',
                  limit: 6,
                  showTick: true
                },
                {
                  color: '#F5CD19',
                  limit: 12,
                  showTick: true
                },
                {
                  color: '#F58B19',
                  limit: 18,
                  showTick: true
                },
                {
                  color: '#EA4228',
                  limit: 24,
                  showTick: true
                }
              ]
            }}
            maxValue={24}
            minValue={0}
            value={Number(underperformedFinalizerSessionCount.toString())}
          />
        </CardSummary>
      </StyledDiv>}
      <Table
        empty={dataLoaded && finalizerScores.length === 0 && <div>{'No ABFT scores found.'}</div>}
        emptySpinner={
          <>
            {!dataLoaded && <div>{'Querying ABFT scores...'}</div>}
          </>
        }
        header={headerRef}
      >
        {list.map(({ abftScore, accountId, session }): React.ReactNode => (
          <FinalizerPerformance
            abftScore={abftScore}
            address={accountId}
            filterName={''}
            key={session}
            session={session}
          />
        ))}
      </Table>
    </>
  );
}

const StyledDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export default React.memo(FinalizerHistoricPerformance);
