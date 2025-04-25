// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionIndex } from '@polkadot/types/interfaces';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GaugeComponent } from 'react-gauge-component';

import { getCommitteeManagement } from '@polkadot/react-api/getCommitteeManagement';
import { CardSummary, Spinner, styled, Table } from '@polkadot/react-components';
import { useApi, useCall, useLenientThresholdPercentage, useNextTick } from '@polkadot/react-hooks';

import { calculatePercentReward } from '../../Performance/BlockProductionCommitteeList.js';
import useSessionCommitteePerformance from '../../Performance/useCommitteePerformance.js';
import useEraSessionBoundaries from '../../Performance/useEraSessionBoundaries.js';
import useSessionInfo from '../../Performance/useSessionInfo.js';
import MinMaxToggleAndText from '../../react-components/MinMaxToggleAndText/index.js';
import ProducerPerformance from '../../react-components/ProducerPerformance/index.js';
import { range } from '../../util.js';

interface Props {
  address: string;
}

function ValidatorHistoricPerformance ({ address }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const lenientThresholdPercentage = useLenientThresholdPercentage();
  const sessionInfo = useSessionInfo();

  const isNextTick = useNextTick();

  const [inputEra, setInputEra] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (sessionInfo && !inputEra) {
      setInputEra(sessionInfo.currentEra);
    }
  }, [sessionInfo, inputEra]);

  const ref = useRef(inputEra);
  ref.current !== inputEra && console.log('Reference changed!')


  const eraSessionBoundary = useEraSessionBoundaries({ era: inputEra });

  const pastSessions = useMemo(() => {
    if (eraSessionBoundary) {
      return range(eraSessionBoundary.eraEndSession - eraSessionBoundary.firstSession + 1, eraSessionBoundary.firstSession);
    }

    return [];
  }, [eraSessionBoundary]
  );

  const sessionCommitteePerformance = useSessionCommitteePerformance(pastSessions);

  const filteredSessionPerformances = useMemo(() => {
    return sessionCommitteePerformance.map(({ expectedBlockCount, performance, sessionId }) => {
      return performance.filter((performance) => performance.accountId === address).map((performance) => {
        return [performance.blockCount, sessionId, expectedBlockCount];
      });
    }).flat();
  },
  [sessionCommitteePerformance, address]);

  const numberOfNonZeroPerformances = useMemo(() => {
    return sessionCommitteePerformance.filter(({ performance }) =>
      performance.length).length;
  },
  [sessionCommitteePerformance]);

  const headerRef = useRef<[string, string, number?][]>(
    [
      ['account', 'start', 1],
      ['session', 'expand'],
      ['blocks created', 'expand'],
      ['max % reward', 'expand']
    ]
  );

  const list = useMemo(
    () => isNextTick
      ? filteredSessionPerformances
      : [],
    [isNextTick, filteredSessionPerformances]
  );

  const underperformedValidatorSessionCount = useCall<SessionIndex>(
    getCommitteeManagement(api).query.underperformedValidatorSessionCount,
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
      {underperformedValidatorSessionCount !== undefined && <StyledDiv>
        <CardSummary
          label={'Underperformed Production Session Count'}
        >
          <GaugeComponent
            arc={{
              subArcs: [
                {
                  color: '#5BE12C',
                  limit: 12,
                  showTick: true
                },
                {
                  color: '#F5CD19',
                  limit: 24,
                  showTick: true
                },
                {
                  color: '#F58B19',
                  limit: 36,
                  showTick: true
                },
                {
                  color: '#EA4228',
                  limit: 48,
                  showTick: true
                }
              ]
            }}
            maxValue={48}
            minValue={0}
            value={Number(underperformedValidatorSessionCount.toString())}
          />
        </CardSummary>
      </StyledDiv>}
      <Table
        empty={numberOfNonZeroPerformances === pastSessions.length && <div>{'No entries found'}</div>}
        emptySpinner={
          <>
            {(numberOfNonZeroPerformances !== pastSessions.length) && <div>{'Querying past performances'}</div>}
          </>
        }
        header={headerRef.current}
      >
        {list?.map((performance): React.ReactNode => (
          <ProducerPerformance
            address={address}
            blocksCreated={performance[0]}
            filterName={''}
            key={performance[1]}
            rewardPercentage={calculatePercentReward(performance[0], performance[2], lenientThresholdPercentage, true)}
            session={performance[1]}
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

export default React.memo(ValidatorHistoricPerformance);
