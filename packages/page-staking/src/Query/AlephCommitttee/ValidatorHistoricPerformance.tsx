// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useLenientThresholdPercentage, useNextTick } from '@polkadot/react-hooks';

import { calculatePercentReward } from '../../Performance/BlockProductionCommitteeList.js';
import useSessionCommitteePerformance from '../../Performance/useCommitteePerformance.js';
import useSessionInfo from '../../Performance/useSessionInfo.js';
import ProducerPerformance from '../../react-components/ProducerPerformance/index.js';
import { range } from '../util.js';

interface Props {
  address: string;
}

function ValidatorHistoricPerformance ({ address }: Props): React.ReactElement<Props> {
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

  return (
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
  );
}

export default React.memo(ValidatorHistoricPerformance);
