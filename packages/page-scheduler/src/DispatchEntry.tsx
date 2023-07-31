// Copyright 2017-2023 @polkadot/app-scheduler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveDispatch } from '@polkadot/api-derive/types';

import React from 'react';

import PreImageButton from '@azero.dev/app-democracy/Overview/PreImageButton';
import ProposalCell from '@azero.dev/app-democracy/Overview/ProposalCell';
import { LinkExternal, Table } from '@azero.dev/react-components';
import { useBestNumber } from '@azero.dev/react-hooks';
import { BlockToTime } from '@azero.dev/react-query';
import { formatNumber } from '@polkadot/util';

interface Props {
  value: DeriveDispatch;
}

function DispatchEntry ({ value: { at, image, imageHash, index } }: Props): React.ReactElement<Props> {
  const bestNumber = useBestNumber();

  return (
    <tr>
      <Table.Column.Id value={index} />
      <ProposalCell
        imageHash={imageHash}
        proposal={image?.proposal}
      />
      <td className='number together'>
        {bestNumber && (
          <>
            <BlockToTime value={at.sub(bestNumber)} />
            #{formatNumber(at)}
          </>
        )}
      </td>
      <td className='button'>
        {!image?.proposal && (
          <PreImageButton
            imageHash={imageHash}
            isImminent
          />
        )}
      </td>
      <td className='links media--1000'>
        <LinkExternal
          data={index}
          type='democracyReferendum'
        />
      </td>
    </tr>
  );
}

export default React.memo(DispatchEntry);
