// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, Address } from '@polkadot/types/interfaces';

import React from 'react';

import IdentityIcon from './IdentityIcon/index.js';
import AccountName from './AccountName.js';
import AzeroId from './AzeroId.js';
import ParentAccount from './ParentAccount.js';
import { styled } from './styled.js';

interface Props {
  children?: React.ReactNode;
  className?: string;
  defaultName?: string;
  isAzeroIdShown?: boolean;
  isParentAddressShown?: boolean;
  onClickName?: () => void;
  overrideName?: React.ReactNode;
  parentAddress?: string;
  withSidebar?: boolean;
  withShortAddress?: boolean;
  toggle?: unknown;
  value?: string | Address | AccountId | null | Uint8Array;
}

function AddressSmall ({ children, className = '', defaultName, isAzeroIdShown = false, isParentAddressShown = false, onClickName, overrideName, parentAddress, toggle, value, withShortAddress = false, withSidebar = true }: Props): React.ReactElement<Props> {
  return (
    <Container
      className={className}
      isAzeroIdShown={isAzeroIdShown}
      isParentAddressShown={isParentAddressShown}
      withShortAddress={withShortAddress}
    >
      {isParentAddressShown && parentAddress && (
        <StyledParentAccount
          address={parentAddress}
          className='parentName'
        />
      )}
      <StyledIdentityIcon
        className='identityIcon'
        value={value as Uint8Array}
      />
      <StyleAccountName
        className={`accountName ${withSidebar ? 'withSidebar' : ''}`}
        defaultName={defaultName}
        onClick={onClickName}
        override={overrideName}
        toggle={toggle}
        value={value}
        withSidebar={withSidebar}
      >
        {children}
      </StyleAccountName>
      {withShortAddress && (
        <ShortAddress
          className='shortAddress'
          data-testid='short-address'
        >
          {value}
        </ShortAddress>
      )}
      {isAzeroIdShown && (
        <AzeroId
          address={value}
          className='azeroIdDomain'
        />
      )}
    </Container>
  );
}

const Container = styled.div<{isAzeroIdShown: boolean, isParentAddressShown: boolean, withShortAddress: boolean}>`
  padding-block: 0.75rem;

  display: grid;
  grid-template-columns: max-content 1fr;
  grid-template-rows: ${({ isAzeroIdShown, isParentAddressShown, withShortAddress }) => `${isParentAddressShown ? 'minmax(18px, max-content)' : 0} max-content ${withShortAddress ? 'minmax(22px, max-content)' : 0} ${isAzeroIdShown ? 'minmax(18px, max-content)' : 0}`};
  grid-template-areas:
    "     .        parentName  "
    "identityIcon  accountName "
    "     .       shortAddress "
    "     .       azeroIdDomain";

  align-items: center;
  column-gap: 0.5rem;

  .parentName {
    grid-area: parentName;
  }

  .identityIcon {
    grid-area: identityIcon;
  }

  .accountName {
    grid-area: accountName;
  }

  .shortAddress {
    grid-area: shortAddress;
  }

  .azeroIdDomain {
    grid-area: azeroIdDomain;
  }
`;

const StyledParentAccount = styled(ParentAccount)`
  font-size: var(--font-size-small);
`;

const StyledIdentityIcon = styled(IdentityIcon)`
  width: 26px;
  height: 26px;
  flex-shrink: 0;
`;

const StyleAccountName = styled(AccountName)`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ShortAddress = styled.p`
  margin-bottom: 0.25rem;

  font-size: var(--font-size-small);
  color: #8B8B8B;

  width: var(--width-shortaddr);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default React.memo(AddressSmall);
