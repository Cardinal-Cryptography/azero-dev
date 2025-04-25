// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Spinner, SummaryBox } from '@polkadot/react-components';

import useSessionInfo from '../Performance/useSessionInfo.js';
import FutureValidators from './FutureValidators.js';
import SummarySession from './SummarySession.js';

function FutureCommitteePage (): React.ReactElement {
  const sessionInfo = useSessionInfo();

  if (sessionInfo === undefined) {
    return (
      <Spinner label={'loading data'} />
    );
  }

  return (
    <div className='staking--Performance'>
      <SummaryBox>
        <section>
          <SummarySession
            session={sessionInfo.currentSession}
          />
        </section>
      </SummaryBox>
      <FutureValidators
        currentSession={sessionInfo.currentSession}
        maximumSessionNumber={sessionInfo.maximumSessionNumber}
      />
    </div>
  );
}

export default React.memo(FutureCommitteePage);
