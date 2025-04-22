// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EraFirstSession } from './useErasStartSessionIndexLookup.js';

import { useMemo } from 'react';

import { createNamedHook } from '@polkadot/react-hooks';

import useErasStartSessionIndexLookup from './useErasStartSessionIndexLookup.js';

export interface EraSessionBoundaries extends EraFirstSession {
  eraEndSession?: number;
}

/**
 * For a given era, this hook retrieves its first and last session, using staking data. Normally, next era starts
 * a const number of sessions after the previous one, but pallet staking supports forcing era functionality,
 * hence eras might start at an arbitrary session.
 *
 * This hook is implemented in a way that even if input sessions changes and new era started meanwhile, still old
 * (incorrect) era number will be returned. This is because useErasStartSessionIndexLookup() used below cannot
 * listen to new eras. Normally this is not a problem, but if user waits long enough not refreshing page, ie to
 * tje current era + 1, then displayed era in this summary would be incorrect.
 * @param session A session number to query ere
 */
function useEraSessionBoundariesImpl (session: number): EraSessionBoundaries | undefined {
  const erasStartSessionIndexLookup = useErasStartSessionIndexLookup();

  function calculatePastEraBoundaries (session: number, eraToFirstSessionLookup: EraFirstSession[]): EraSessionBoundaries | undefined {
    for (let i = 0; i < eraToFirstSessionLookup.length; i++) {
      const eraIndex = eraToFirstSessionLookup[i].era;
      const currentEraSessionStart = eraToFirstSessionLookup[i].firstSession;
      const currentEraSessionEnd = i + 1 < eraToFirstSessionLookup.length ? eraToFirstSessionLookup[i + 1].firstSession - 1 : undefined;

      if (currentEraSessionStart <= session && currentEraSessionEnd && session <= currentEraSessionEnd) {
        return {
          era: eraIndex,
          eraEndSession: currentEraSessionEnd,
          firstSession: currentEraSessionStart
        };
      }
    }

    return undefined;
  }

  function calculateCurrentEraBoundaries (eraToFirstSessionLookup: EraFirstSession[]): EraSessionBoundaries {
    const lastErasStartSessionIndexLookup = eraToFirstSessionLookup.length - 1;

    return eraToFirstSessionLookup[lastErasStartSessionIndexLookup];
  }

  return useMemo((): EraFirstSession | undefined => {
    if (erasStartSessionIndexLookup.length > 0) {
      const pastEraBoundaries = calculatePastEraBoundaries(session, erasStartSessionIndexLookup);

      if (!pastEraBoundaries) {
        return calculateCurrentEraBoundaries(erasStartSessionIndexLookup);
      }

      return pastEraBoundaries;
    }

    return undefined;
  }, [session, erasStartSessionIndexLookup]);
}

export default createNamedHook('useEraSessionBoundaries', useEraSessionBoundariesImpl);
