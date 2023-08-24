// Copyright 2017-2023 @polkadot/app-addresses authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { DeriveAccountInfo } from '@polkadot/api-derive/types';
import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { ModalProps as Props } from '../types.js';

import { resolveDomainToAddress } from '@azns/resolver-core';
import React, { useCallback, useState } from 'react';

import { AddressRow, Button, Input, InputAddress, Modal, systemNameToChainId } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { hexToU8a } from '@polkadot/util';
import { ethereumEncode } from '@polkadot/util-crypto';

import { useTranslation } from '../translate.js';

interface AddrState {
  address: string;
  addressInput: string;
  isAddressExisting: boolean;
  isAddressValid: boolean;
}

interface NameState {
  isNameValid: boolean;
  name: string;
}

const getValidatedAddress = (address: string, isEthereum: boolean): string | undefined => {
  try {
    if (isEthereum) {
      const rawAddress = hexToU8a(address);

      return ethereumEncode(rawAddress);
    }

    const publicKey = keyring.decodeAddress(address);

    return keyring.encodeAddress(publicKey);
  } catch {
    return undefined;
  }
};

const getAddressFromDomain = async (domain: string, { api, systemChain }: {api: ApiPromise, systemChain: string}): Promise<string | null | undefined> => {
  const chainId = systemNameToChainId.get(systemChain);

  if (!chainId) {
    return;
  }

  try {
    return (await resolveDomainToAddress(domain, { chainId, customApi: api })).address;
  } catch {
    return undefined;
  }
};

function Create ({ onClose, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, isEthereum, systemChain } = useApi();
  const [{ isNameValid, name }, setName] = useState<NameState>({ isNameValid: false, name: '' });
  const [{ address, addressInput, isAddressExisting, isAddressValid }, setAddress] = useState<AddrState>({ address: '', addressInput: '', isAddressExisting: false, isAddressValid: false });
  const info = useCall<DeriveAccountInfo>(!!address && isAddressValid && api.derive.accounts.info, [address]);
  const isValid = (isAddressValid && isNameValid) && !!info?.accountId;

  const _onChangeAddressAsync = useCallback(
    async (input: string): Promise<void> => {
      let address: string | null | undefined = getValidatedAddress(input, isEthereum);
      let isAddressExisting = false;

      if (!address) {
        address = await getAddressFromDomain(input, { api, systemChain });
      }

      const isAddressValid = !!address;

      if (address) {
        const old = keyring.getAddress(address);

        if (old) {
          const newName = old.meta.name || name;

          isAddressExisting = true;

          setName({ isNameValid: !!(newName || '').trim(), name: newName });
        }
      }

      setAddress({ address: address || '', addressInput: input, isAddressExisting, isAddressValid });
    },
    [isEthereum, name, api, systemChain]
  );

  const _onChangeAddress = useCallback(
    (input: string) => {
      _onChangeAddressAsync(input).catch(console.error);
    },
    [_onChangeAddressAsync]
  );

  const _onChangeName = useCallback(
    (name: string) => setName({ isNameValid: !!name.trim(), name }),
    []
  );

  const _onCommit = useCallback(
    (): void => {
      const status = { action: 'create' } as ActionStatus;

      if (!isValid || !info?.accountId) {
        return;
      }

      try {
        const address = info.accountId.toString();

        keyring.saveAddress(address, { genesisHash: keyring.genesisHash, name: name.trim(), tags: [] });

        status.account = address;
        status.status = address ? 'success' : 'error';
        status.message = isAddressExisting
          ? t<string>('address edited')
          : t<string>('address created');

        InputAddress.setLastValue('address', address);
      } catch (error) {
        status.status = 'error';
        status.message = (error as Error).message;
      }

      onStatusChange(status);
      onClose();
    },
    [info, isAddressExisting, isValid, name, onClose, onStatusChange, t]
  );

  return (
    <Modal
      header={t<string>('Add an address')}
      onClose={onClose}
    >
      <Modal.Content>
        <AddressRow
          defaultName={name}
          isAzeroIdShown
          noDefaultNameOpacity
          value={
            isAddressValid
              ? info?.accountId?.toString()
              : undefined
          }
        >
          <Input
            autoFocus
            className='full'
            isError={!isAddressValid}
            label={t<string>('address')}
            onChange={_onChangeAddress}
            onEnter={_onCommit}
            placeholder={t<string>('new address')}
            value={addressInput}
          />
          <Input
            className='full'
            isError={!isNameValid}
            label={t<string>('name')}
            onChange={_onChangeName}
            onEnter={_onCommit}
            value={name}
          />
        </AddressRow>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon='save'
          isDisabled={!isValid}
          label={t<string>('Save')}
          onClick={_onCommit}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Create);
