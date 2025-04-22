// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionIndex } from '@polkadot/types/interfaces';

import React, { useMemo, useRef } from 'react';

import { getCommitteeManagement } from '@polkadot/react-api/getCommitteeManagement';
import {CardSummary, styled, SummaryBox, Table} from '@polkadot/react-components';
import { useApi, useCall, useLenientThresholdPercentage, useNextTick } from '@polkadot/react-hooks';

import { calculatePercentReward } from '../../Performance/BlockProductionCommitteeList.js';
import useSessionCommitteePerformance from '../../Performance/useCommitteePerformance.js';
import useSessionInfo from '../../Performance/useSessionInfo.js';
import ProducerPerformance from '../../react-components/ProducerPerformance/index.js';
import { range } from '../util.js';
import {GaugeComponent} from "react-gauge-component";

interface Props {
  address: string;
}

function ValidatorHistoricPerformance ({ address }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const lenientThresholdPercentage = useLenientThresholdPercentage();
  const sessionInfo = useSessionInfo();
  const isNextTick = useNextTick();

  const pastSessions = useMemo(() => {
    if (sessionInfo) {
      const maxSessionQueryDepth = 4 * sessionInfo.historyDepth;

      const minSessionNumber = Math.max(sessionInfo.minimumSessionNumber, sessionInfo.currentSession - maxSessionQueryDepth);
      const queryDepth = sessionInfo.currentSession - minSessionNumber;

      return range(queryDepth, sessionInfo.currentSession - queryDepth).reverse();
    }

    return [];
  }, [sessionInfo]
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
      ['session performance in last 4 eras', 'start', 1],
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

  return (
    <>
      {underperformedValidatorSessionCount !== undefined && <StyledDiv>
        <CardSummary
          label={'Underperformed Production Session Count'}
        >
          <GaugeComponent
            arc={{
              subArcs: [
                {
                  limit: 12,
                  color: '#5BE12C',
                  showTick: true
                },
                {
                  limit: 24,
                  color: '#F5CD19',
                  showTick: true
                },
                {
                  limit: 36,
                  color: '#F58B19',
                  showTick: true
                },
                {
                  limit: 48,
                  color: '#EA4228',
                  showTick: true
                }
              ]
            }}
            value={Number(underperformedValidatorSessionCount.toString())}
            maxValue={48}
            minValue={0}
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
