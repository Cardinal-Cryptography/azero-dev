// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { Codec } from '@polkadot/types/types';
import type { ChainAbftScore } from './types.js';
import type {ApiPromise} from "@polkadot/api";
import {getCommitteeManagement} from "@polkadot/react-api/getCommitteeManagement";
import {getSessionFirstAndLastBlock} from "./Query/util.js";

export function decodeChainAbftScore (chainAbftScore: Codec | undefined, session: number) {
  if (chainAbftScore === undefined) {
    return {
      abftScore: [],
      session
    };
  }

  const maybeChainAbftScore = chainAbftScore as unknown as Option<ChainAbftScore>;

  if (maybeChainAbftScore.isSome) {
    const chainAbftScore = maybeChainAbftScore.unwrap();
    const abftScores = chainAbftScore.points.map((points, index) => ({
      nodeIndex: index,
      score: Number(points.toString())
    }));

    return {
      abftScore: abftScores,
      session
    };
  } else {
    return {
      abftScore: [],
      session
    };
  }
}

export const fetchAbtfScoreForSession = async (sessionNo: number, api: ApiPromise, currentSessionNo: number) => {
  if (sessionNo === currentSessionNo) {
    return api.query.aleph.abftScores(currentSessionNo);
  }

  const sessionPeriod = Number(getCommitteeManagement(api).consts.sessionPeriod.toString());
  const lastSessionBlockNo = getSessionFirstAndLastBlock(sessionNo, sessionPeriod).last;
  const hash = await api.rpc.chain.getBlockHash(lastSessionBlockNo);

  if (hash.isEmpty) {
    return undefined;
  }

  const apiAtBlock = await api.at(hash.toString());

  return apiAtBlock.query.aleph.abftScores?.(sessionNo);
};
