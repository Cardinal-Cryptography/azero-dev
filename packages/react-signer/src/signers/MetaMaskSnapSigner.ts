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
    // TODO: Test this
    // TODO: If it doesn't work, compare this signing and sending ethod with signAndSend in snap
    // TODO: If that doesn't work, get in touch with Azero team and ask them if they can help
    // const raw = this.#registry.createType('ExtrinsicPayload', payload, { version: payload.version });
    const signature = await snap.signSignerPayloadJSON(payload);

    return {
      id: ++id,
      signature
    };
  }
}
