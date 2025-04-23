// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { Codec } from '@polkadot/types/types';
import type { ChainAbftScore } from './types.js';

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
