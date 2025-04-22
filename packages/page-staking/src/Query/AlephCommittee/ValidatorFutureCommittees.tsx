// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { FutureCommittee } from '../../Performance/useFutureSessionCommittee.js';

import React, { useMemo, useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useNextTick } from '@polkadot/react-hooks';

import useFutureSessionCommittee from '../../Performance/useFutureSessionCommittee.js';
import useSessionInfo from '../../Performance/useSessionInfo.js';
import ProducerPerformance from '../../react-components/ProducerPerformance/index.js';
import { range } from '../util.js';

interface Props {
  address: string;
}

function ValidatorFutureCommittees ({ address }: Props): React.ReactElement<Props> {
  const sessionInfo = useSessionInfo();
  const isNextTick = useNextTick();

  const futureSessions = useMemo(() => {
    if (sessionInfo) {
      if (sessionInfo.currentSession < sessionInfo.maximumSessionNumber) {
        return range(sessionInfo.maximumSessionNumber - sessionInfo.currentSession, sessionInfo.currentSession + 1);
      }
    }

    return [];
  }, [sessionInfo]);

  const futureSessionCommittee = useFutureSessionCommittee(futureSessions);
  const filteredSessionCommittee: FutureCommittee[] = useMemo(() => {
    if (address) {
      return futureSessionCommittee.filter((committee) => committee !== undefined && committee.producers.includes(address));
    }

    return [];
  }, [futureSessionCommittee, address]);

  const futureSessionsList: FutureCommittee[] = useMemo(
    () => isNextTick
      ? filteredSessionCommittee
      : [],
    [isNextTick, filteredSessionCommittee]
  );

  const headerRefFutureCommittee = useRef<[string, string, number?][]>(
    [
      ['future committee sessions', 'start', 1],
      ['session', 'expand'],
      ['blocks created', 'expand'],
      ['max % reward', 'expand']
    ]
  );

  return (
    <Table
      empty={filteredSessionCommittee.length === futureSessions.length && <div>{'No entries found'}</div>}
      emptySpinner={
        <>
          {(filteredSessionCommittee.length !== futureSessions.length) && <div>{'Querying future sessions'}</div>}
        </>
      }
      header={headerRefFutureCommittee.current}
    >
      {futureSessionsList?.map((committee): React.ReactNode => (
        <ProducerPerformance
          address={address}
          blocksCreated={0}
          filterName={''}
          key={committee.session}
          rewardPercentage={'0.0'}
          session={committee.session}
        />
      ))}
    </Table>
  );
}

export default React.memo(ValidatorFutureCommittees);
