// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import Address from '@polkadot/app-staking/Performance/Address';
import useSessionCommitteePerformance, { ValidatorPerformance } from '@polkadot/app-staking/BlockCounter/useCommitteePerformance';
import useCurrentSessionInfo from '@polkadot/app-staking/Performance/useCurrentSessionInfo';
import { Button, InputAddressSimple, Table } from '@polkadot/react-components';
import { useApi, useLoadingDelay } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Validator from './Validator';

interface Props {
  className?: string;
}

function Query ({ className }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { t } = useTranslation();
  const { value } = useParams<{ value: string }>();
  const [validatorId, setValidatorId] = useState<string | null>(value || null);

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
      const maxSessionQueryDepth = 84 * historyDepth;
      const minSessionNumber = Math.max(minimumSessionNumber, currentSession - maxSessionQueryDepth);
      const queryDepth = currentSession - minSessionNumber;

      return range(queryDepth, currentSession - queryDepth);
    }

    return [];
  }, [currentSession, currentEra, historyDepth, minimumSessionNumber]
  );

  const blockCounter = useSessionCommitteePerformance(pastSessions);
  console.log(blockCounter);

  const list = useMemo(
    () => isLoading
      ? []
      : Object.keys(blockCounter).map((account) => [account, blockCounter[account]]).sort(([a1,a2], [b1, b2]) => b2 - a2),
    [isLoading, blockCounter]
  );

  const _onQuery = useCallback(
    (): void => {
      if (validatorId) {
        window.location.hash = `/staking/query/${validatorId}`;
      }
    },
    [validatorId]
  );

  const headerRef = useRef(
    [
      [t('session performance in last 4 eras'), 'start', 1],
      [t('blocks created'), 'expand'],
    ]
  );

  return (
    <div className={className}>
      <InputAddressSimple
        className='staking--queryInput'
        defaultValue={value}
        help={t<string>('Display overview information for the selected validator, including blocks produced.')}
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
      {value && !!isAlephChain && <Table
        className={className}
        header={headerRef.current}
      >
        {list && list.map(([account, count]): React.ReactNode => (
          <Address
            address={account}
            blocksCreated={count}
          />
        ))}
      </Table>}
      {value && (
        <Validator validatorId={value} />
      )}
    </div>
  );
}

export default React.memo(Query);
