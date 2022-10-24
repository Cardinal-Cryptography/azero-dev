// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo, useState } from 'react';

import Performance from '@polkadot/app-staking/Performance/Performance';
import useCurrentSessionInfo from '@polkadot/app-staking/Performance/useCurrentSessionInfo';
import { useTranslation } from '@polkadot/app-staking/translate';
import { Button, Input, MarkWarning, Spinner } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import useEra from './useEra';

export interface SessionEra {
  session: number,
  era: number,
  currentSessionMode: boolean,
}

function BlockCounter (): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();

  const [currentSession, currentEra, historyDepth, minimumSessionNumber] = useCurrentSessionInfo();

  const [inputSession, setInputSession] = useState<number | undefined>(undefined);
  const era = useEra(inputSession);

  const sessionEra = useMemo((): SessionEra | undefined => {
    if (era && inputSession) {
      return { currentSessionMode: false, era, session: inputSession };
    }

    if (currentSession && currentEra) {
      return { currentSessionMode: true, era: currentEra, session: currentSession };
    }

    return undefined;
  }, [inputSession, currentEra, currentSession, era]);

  if (!api.runtimeChain.toString().includes('Aleph Zero')) {
    return (
      <MarkWarning content={'Unsupported chain.'} />
    );
  }

  if (!sessionEra) {
    return (
      <Spinner label={'loading data'} />
    );
  }

  return (
      <section>
        <Performance
          sessionEra={sessionEra}
        />
      </section>
  );
}

export default React.memo(BlockCounter);
