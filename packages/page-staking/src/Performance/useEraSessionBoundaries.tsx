// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EraFirstSession } from './useErasStartSessionIndexLookup.js';

import { useMemo } from 'react';

import { createNamedHook } from '@polkadot/react-hooks';

import useErasStartSessionIndexLookup from './useErasStartSessionIndexLookup.js';
import useSessionInfo from './useSessionInfo.js';

export interface EraSessionBoundaries extends EraFirstSession {
  eraEndSession: number;
}

export interface Props {
  session?: number;
  era?: number;
}

/**
 * For a given era, this hook retrieves its first and last session.
 * For a given session, this hook the first and last session of an ere given session belongs to.
 * Either era or sessions should be passed,.
 *
 * Normally, next era starts a const number of sessions after the previous one, but pallet staking supports
 * forcing era functionality, hence eras might start at an arbitrary session.
 *
 * This hook is implemented in a way that even if input sessions changes and new era started meanwhile, still old
 * (incorrect) era number will be returned. This is because useErasStartSessionIndexLookup() used below cannot
 * listen to new eras. Normally this is not a problem, but if user waits long enough not refreshing page, ie to
 * tje current era + 1, then displayed era in this summary would be incorrect.
 * @param session A session number to query ere
 * @param era A session number to query ere
 */
function useEraSessionBoundariesImpl ({ era, session }: Props): EraSessionBoundaries | undefined {
  const erasStartSessionIndexLookup = useErasStartSessionIndexLookup();
  const sessionInfo = useSessionInfo();

  function calculatePastEraBoundaries (eraToFirstSessionLookup: EraFirstSession[], currentSession: number, session?: number, era?: number): EraSessionBoundaries | undefined {
    // assert((session !== undefined) !== (era !== undefined), "era XOR session must be true!");
    for (let i = 0; i < eraToFirstSessionLookup.length; i++) {
      const eraIndex = eraToFirstSessionLookup[i].era;
      const currentEraSessionStart = eraToFirstSessionLookup[i].firstSession;
      const currentEraSessionEnd = i + 1 < eraToFirstSessionLookup.length ? eraToFirstSessionLookup[i + 1].firstSession - 1 : currentSession;

      if (
        (session && currentEraSessionStart <= session && currentEraSessionEnd && session <= currentEraSessionEnd) ||
        (era && eraIndex === era)
      ) {
        return {
          era: eraIndex,
          eraEndSession: currentEraSessionEnd,
          firstSession: currentEraSessionStart
        };
      }
    }

    return undefined;
  }

  function calculateCurrentEraBoundaries (eraToFirstSessionLookup: EraFirstSession[], currentSession: number): EraSessionBoundaries {
    const lastErasStartSessionIndexLookup = eraToFirstSessionLookup.length - 1;

    return {
      ...eraToFirstSessionLookup[lastErasStartSessionIndexLookup],
      eraEndSession: currentSession
    };
  }

  return useMemo((): EraSessionBoundaries | undefined => {
    if (erasStartSessionIndexLookup.length > 0 && sessionInfo) {
      const pastEraBoundaries = calculatePastEraBoundaries(
        erasStartSessionIndexLookup, sessionInfo.currentSession, session, era);

      if (!pastEraBoundaries) {
        return calculateCurrentEraBoundaries(erasStartSessionIndexLookup, sessionInfo.currentSession);
      }

      return pastEraBoundaries;
    }

    return undefined;
  }, [session, erasStartSessionIndexLookup, sessionInfo, era]);
}

export default createNamedHook('useEraSessionBoundaries', useEraSessionBoundariesImpl);
