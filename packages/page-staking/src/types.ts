// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Inflation } from '@polkadot/react-hooks/types';
import type { Struct, Vec } from '@polkadot/types';
import type { AccountId, Balance, BlockNumber, EraIndex, Hash, SessionIndex, ValidatorPrefs, ValidatorPrefsTo196 } from '@polkadot/types/interfaces';
import type { SpStakingExposurePage, SpStakingIndividualExposure, SpStakingPagedExposureMetadata } from '@polkadot/types/lookup';
import type { u16, u32 } from '@polkadot/types-codec';
import type { BN } from '@polkadot/util';

export type Nominators = Record<string, string[]>;

export type AccountFilter = 'all' | 'controller' | 'session' | 'stash' | 'unbonded';

export type ValidatorFilter = 'all' | 'hasNominators' | 'noNominators' | 'hasWarnings' | 'noWarnings' | 'iNominated' | 'nextSet';

export interface NominatedBy {
  index: number;
  nominatorId: string;
  submittedIn: EraIndex;
}

export type NominatedByMap = Record<string, NominatedBy[]>;

export interface Slash {
  accountId: AccountId;
  amount: Balance;
}

export interface SessionRewards {
  blockHash: Hash;
  blockNumber: BlockNumber;
  isEventsEmpty: boolean;
  parentHash: Hash;
  reward: Balance;
  sessionIndex: SessionIndex;
  slashes: Slash[];
  treasury: Balance;
}

interface ValidatorInfoRank {
  rankBondOther: number;
  rankBondOwn: number;
  rankBondTotal: number;
  rankNumNominators: number;
  rankOverall: number;
  rankReward: number;
}

export interface EraValidators {
  reserved: Vec<AccountId>;
  nonReserved: Vec<AccountId>;
}

export interface ValidatorInfo extends ValidatorInfoRank {
  accountId: AccountId;
  bondOther: BN;
  bondOwn: BN;
  bondShare: number;
  bondTotal: BN;
  commissionPer: number;
  exposurePaged: SpStakingExposurePage;
  exposureMeta: SpStakingPagedExposureMetadata
  isActive: boolean;
  isBlocking: boolean;
  isElected: boolean;
  isFavorite: boolean;
  isNominating: boolean;
  key: string;
  knownLength: BN;
  lastPayout?: BN;
  minNominated: BN;
  nominators: Vec<SpStakingIndividualExposure>;
  numNominators: number;
  numRecentPayouts: number;
  skipRewards: boolean;
  stakedReturn: number;
  stakedReturnCmp: number;
  validatorPrefs?: ValidatorPrefs | ValidatorPrefsTo196;
  withReturns?: boolean;
}

export type TargetSortBy = keyof ValidatorInfoRank;

export interface SortedTargets {
  avgStaked?: BN;
  counterForNominators?: BN;
  counterForValidators?: BN;
  eraValidators?: EraValidators;
  electedIds?: string[];
  historyDepth?: BN;
  inflation: Inflation;
  lastEra?: BN;
  lowStaked?: BN;
  medianComm: number;
  maxNominatorsCount?: BN;
  maxValidatorsCount?: BN;
  minNominated: BN;
  minNominatorBond?: BN;
  minValidatorBond?: BN;
  nominators?: string[];
  nominateIds?: string[];
  totalStaked?: BN;
  totalIssuance?: BN;
  validators?: ValidatorInfo[];
  validatorIds?: string[];
  waitingIds?: string[];
}

// Represents type directly as chain storage. sessionId and nonce are not used by the logic below, and are there only
// for decoding.
export interface ChainAbftScore extends Struct {
  sessionId: SessionIndex;
  nonce: u32;
  points: Vec<u16>;
}

type Score = number;
interface AbftScore {
  nodeIndex: number;
  score: Score;
}

/**
 * ABFT score for finalization committee in a session. This hook outputs an array of those objects.
 * Session number is always populated. `abftScore` can be an empty array, which happens in any of the below scenarios:
 *    - finality version is < 5, ie scores are not enabled
 *    - Option<ChainAbftScore> value is None in the chain storage
 *    - scores are not yet aggregated (roughly this means we are in the first 60 seconds of the session)
 */
export interface AbftScores {
  session: number;
  abftScore: AbftScore[];
}
