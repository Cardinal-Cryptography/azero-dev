// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { INumber } from '@polkadot/types/types';

import React, { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Button, InputAddressSimple, Spinner, styled, ToggleGroup } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import ValidatorFutureCommittees from './AlephCommittee/ValidatorFutureCommittees.js';
import ValidatorHistoricPerformance from './AlephCommittee/ValidatorHistoricPerformance.js';
import ValidatorCharts from "./ValidatorCharts.js";

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

  const groups = [
    { text: t('Charts'), value: 'charts' },
    { text: t('Past finalizer performance'), value: 'past-finalizer' },
    { text: t('Past validator performance'), value: 'past-validator' },
    { text: t('Future committees'), value: 'future' }
  ];
  const [groupIndex, setGroupIndex] = useState(0);

  const eras = useCall<INumber[]>(api.derive.staking.erasHistoric);

  const labels = useMemo(
    () => eras?.map((e) => e.toHuman() as string),
    [eras]
  );

  const _onQuery = useCallback(
    () => doQuery(validatorId),
    [validatorId]
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
      {value &&
        <StyledToggleGroup
          onChange={setGroupIndex}
          options={groups}
          value={groupIndex}
        />
      }
      {value && groupIndex === 0 &&
        <ValidatorCharts
          labels={labels}
          validatorId={value}
        />
      }
      {value && groupIndex === 1 &&
        <ValidatorHistoricPerformance
          address={value}
        />
      }
      {value && groupIndex === 2 &&
        <ValidatorHistoricPerformance
          address={value}
        />
      }
      {value && groupIndex === 3 &&
        <ValidatorFutureCommittees
          address={value}
        />
      }
    </div>
  );
}

export default React.memo(Query);

const StyledToggleGroup = styled(ToggleGroup)`
  display: block;
  margin-top: 3rem;
  margin-bottom: 1.5rem;
`;
