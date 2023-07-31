// Copyright 2017-2023 @polkadot/app-ranked authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCounterNamed } from '@azero.dev/app-referenda/useCounter';
import { createNamedHook } from '@azero.dev/react-hooks';

function useCounterImpl (): number {
  return useCounterNamed('fellowshipReferenda');
}

export default createNamedHook('useCounter', useCounterImpl);
