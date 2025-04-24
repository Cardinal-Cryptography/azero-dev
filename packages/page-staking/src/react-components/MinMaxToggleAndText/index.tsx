// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Dispatch, SetStateAction } from 'react';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Button, Input } from '@polkadot/react-components';

interface Props {
  minValue: number | undefined;
  maxValue: number | undefined;
  selectedValue: number;
  onValueChange: Dispatch<SetStateAction<number | undefined>>;
  valueString: string;
}

function MinMaxToggleAndText ({ maxValue, minValue, onValueChange, selectedValue, valueString }: Props): React.ReactElement {
  // used to clear input text
  const [inputValue, setInputValue] = useState('');
  const [parsedValue, setParsedValue] = useState<number | undefined>(undefined);

  useEffect(() => {
    setInputValue(selectedValue.toString());
    setParsedValue(selectedValue);
  }, [selectedValue]);

  const _onChangeKey = useCallback(
    (key: string): void => {
      setInputValue(key);

      let isInputValueCorrect = false;

      if (minValue && maxValue) {
        const value = parseInt(key);

        if (!isNaN(value)) {
          if (minValue <= value && value <= maxValue) {
            isInputValueCorrect = true;
          }
        }
      }

      isInputValueCorrect
        ? setParsedValue(Number(key))
        : setParsedValue(undefined);
    },
    [minValue, maxValue]
  );

  const _onAdd = useCallback(
    (): void => {
      if (parsedValue) {
        onValueChange(parsedValue);
      }
    },
    [parsedValue, onValueChange]
  );

  const help = useMemo(() => {
    const constraints = [
      typeof minValue === 'number' && `not smaller than ${minValue}`,
      typeof maxValue === 'number' && `not greater than ${maxValue}`
    ];

    const msg = constraints.filter(Boolean).join(', ');

    return msg && ` - ${msg}`;
  },
  [maxValue, minValue]
  );

  const _decrementValue = useCallback(
    (): void => {
      if (selectedValue === undefined || minValue === undefined) {
        return;
      }

      const nextValue = Math.max(minValue, selectedValue - 1);

      setInputValue(nextValue.toString());
      setParsedValue(nextValue);
      onValueChange(nextValue);
    },
    [minValue, selectedValue, onValueChange]
  );

  const _incrementValue = useCallback(
    (): void => {
      if (!maxValue) {
        return;
      }

      const nextValue = Math.min(maxValue, (selectedValue || maxValue) + 1);

      setInputValue(nextValue.toString());
      setParsedValue(nextValue);
      onValueChange(nextValue);
    },
    [maxValue, selectedValue, onValueChange]
  );

  const isGoBackDisabled = minValue === undefined || selectedValue === minValue;
  const isGoForwardDisabled = maxValue === undefined || selectedValue === maxValue;

  return (
    <>
      <div className='minmaxtoggle-buttons'>
        <Button
          icon='chevron-left'
          isDisabled={isGoBackDisabled}
          label={`Previous ${valueString}`}
          onClick={_decrementValue}
        />
        <Button
          icon='chevron-right'
          isDisabled={isGoForwardDisabled}
          label={`Next ${valueString}`}
          onClick={_incrementValue}
        />
      </div>
      <div className='minmaxtoggle-value'>
        <Input
          autoFocus
          isError={!parsedValue}
          label={`${valueString} number ${help}`}
          onChange={_onChangeKey}
          onEnter={_onAdd}
          value={inputValue}
        />
      </div>
      <div className='minmaxtoggle-buttons'>
        <Button
          icon='play'
          isDisabled={!parsedValue}
          onClick={_onAdd}
        />
      </div>
    </>
  );
}

export default MinMaxToggleAndText;
