// Copyright 2017-2023 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Signer, SignerResult } from '@polkadot/api/types';
import type { SignerPayloadJSON } from '@polkadot/types/types';

import * as snap from 'azero-snap-adapter';

import { Registry } from '@polkadot/types/types';

let id = 0;

export class MetaMaskSnapSigner implements Signer {
  readonly #registry: Registry;

  constructor (registry: Registry) {
    this.#registry = registry;
  }

  public async signPayload (payload: SignerPayloadJSON): Promise<SignerResult> {
    const signature = await snap.signSignerPayloadJSON(payload);

    return {
      id: ++id,
      signature
    };
  }
}
