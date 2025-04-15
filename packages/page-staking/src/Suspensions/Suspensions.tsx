// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u16, Vec } from '@polkadot/types';
import type { EraIndex, EventRecord, Hash, SessionIndex } from '@polkadot/types/interfaces';
import type { Perbill } from '@polkadot/types/interfaces/runtime';
import type { Codec } from '@polkadot/types/types';
import type { BanInfo, SuspensionEvent } from './index.js';

import { useEffect, useMemo, useState } from 'react';

import { COMMITTEE_MANAGEMENT_NAMES, getCommitteeManagement } from '@polkadot/react-api/getCommitteeManagement';
import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

import useErasStartSessionIndexLookup from '../Performance/useErasStartSessionIndexLookup.js';
import useSessionInfo from '../Performance/useSessionInfo.js';
import useBanned from './useBanned.js';

interface ProductionBanConfig {
  minimalExpectedPerformance: Perbill,
  underperformedSessionCountThreshold: SessionIndex,
  cleanSessionCounterDelay: SessionIndex,
  banPeriod: EraIndex,
}

interface FinalityBanConfig {
  minimalExpectedPerformance: u16,
  underperformedSessionCountThreshold: SessionIndex,
  cleanSessionCounterDelay: SessionIndex,
  banPeriod: EraIndex,
}

function parseEvents (events: EventRecord[], productionBanConfigPeriod: number, finalizationBanConfigPeriod: number): SuspensionEvent[] {
  return events.filter(({ event }) => COMMITTEE_MANAGEMENT_NAMES.includes(event.section) && event.method === 'BanValidators')
    .map(({ event }) => {
      const raw = event.data[0] as unknown as Codec[][];

      return raw.map((value) => {
        const address = value[0].toString();

        const banInfo = value[1].toJSON() as unknown as BanInfo;

        const reason = banInfo.reason;
        const era = Number(banInfo.start.toString());

        if (reason.otherReason !== undefined) {
          return {
            address,
            era,
            suspensionLiftsInEra: era + productionBanConfigPeriod,
            suspensionReason: reason.otherReason.toString()
          };
        } else if (reason.insufficientProduction !== undefined) {
          return {
            address,
            era,
            suspensionLiftsInEra: era + productionBanConfigPeriod,
            suspensionReason: `Insufficient block production in at least ${reason.insufficientProduction.toString()} sessions`
          };
        } else if (reason.insufficientUptime !== undefined) {
          return {
            address,
            era,
            suspensionLiftsInEra: era + productionBanConfigPeriod,
            suspensionReason: `Insufficient block production in at least ${reason.insufficientUptime.toString()} sessions`
          };
        } else if (reason.insufficientFinalization !== undefined) {
          return {
            address,
            era,
            suspensionLiftsInEra: era + finalizationBanConfigPeriod,
            suspensionReason: `Insufficient finalization in at least ${reason.insufficientFinalization.toString()} sessions`
          };
        } else {
          return {
            address,
            era,
            suspensionLiftsInEra: era + productionBanConfigPeriod,
            suspensionReason: 'Unknown ban reason.'
          };
        }
      });
    }).flat();
}

function useSuspensions (): SuspensionEvent[] | undefined {
  const { api } = useApi();
  // below logic is not able to detect kicks in blocks in which elections has failed,
  // as staking.erasStartSessionIndex is not populated (new era does not start)
  const erasStartSessionIndexLookup = useErasStartSessionIndexLookup();
  const [electionBlockHashes, setElectionBlockHashes] = useState<Hash[] | undefined>(undefined);
  const [eventsInBlocks, setEventsInBlocks] = useState<SuspensionEvent[] | undefined>(undefined);
  const [suspensionEvents, setSuspensionEvents] = useState<SuspensionEvent[] | undefined>(undefined);
  const productionBanConfig = useCall<ProductionBanConfig>(getCommitteeManagement(api).query.productionBanConfig);

  const currentProductionBanPeriod = productionBanConfig?.banPeriod;
  const finalityBanConfig = useCall<FinalityBanConfig>(getCommitteeManagement(api).query.finalityBanConfig);
  const currentFinalityBanPeriod = finalityBanConfig?.banPeriod;

  const sessionInfo = useSessionInfo();
  const banned = useBanned();

  const erasElectionsSessionIndexLookup = useMemo((): [number, number][] => {
    return erasStartSessionIndexLookup
      .filter(({ firstSession }) => firstSession > 0)
      .map(({ era, firstSession }) => [era, firstSession - 1]);
  },
  [erasStartSessionIndexLookup]
  );

  useEffect(() => {
    if (!(api && getCommitteeManagement(api).consts) || erasStartSessionIndexLookup.length === 0) {
      return;
    }

    const sessionPeriod = Number(getCommitteeManagement(api).consts.sessionPeriod.toString());
    const promises = erasElectionsSessionIndexLookup.map(([, electionSessionIndex]) => {
      return api.rpc.chain.getBlockHash(electionSessionIndex * sessionPeriod);
    });

    Promise.all(promises)
      .then((blockHashes) => setElectionBlockHashes(blockHashes))
      .catch(console.error);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(erasElectionsSessionIndexLookup)]
  );

  useEffect(() => {
    if (electionBlockHashes === undefined || currentProductionBanPeriod === undefined || currentFinalityBanPeriod === undefined) {
      return;
    }

    const promisesApiAtFirstBlock = electionBlockHashes.map((hash) => api.at(hash.toString()));

    Promise.all(promisesApiAtFirstBlock).then((apis) => {
      const promisesSystemEvents = apis.map((promise) => promise.query.system.events());

      Promise.all(promisesSystemEvents)
        .then((events: Vec<EventRecord>[]) => {
          const parsedEvents = parseEvents(
            events.map((vecOfEvents) => vecOfEvents.toArray()).flat(),
            currentProductionBanPeriod.toNumber(),
            currentFinalityBanPeriod.toNumber()
          );

          setEventsInBlocks(parsedEvents);
        }).catch(console.error);
    }).catch(console.error);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(electionBlockHashes), currentProductionBanPeriod, currentFinalityBanPeriod]
  );

  useEffect(() => {
    if (currentProductionBanPeriod === undefined ||
        currentFinalityBanPeriod === undefined ||
        eventsInBlocks === undefined ||
        banned === undefined ||
        sessionInfo === undefined) {
      return;
    }

    eventsInBlocks.forEach((eventInBlock) => {
      if (banned.find((banned) => banned.account === eventInBlock.address) === undefined) {
        eventInBlock.suspensionLiftsInEra = sessionInfo.currentEra;
      }
    });

    setSuspensionEvents(eventsInBlocks.reverse());
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(eventsInBlocks), currentProductionBanPeriod]
  );

  return suspensionEvents;
}

export default createNamedHook('useSuspensions', useSuspensions);
