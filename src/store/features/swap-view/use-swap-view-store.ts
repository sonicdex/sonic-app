import { useMemo } from 'react';

import { ENV } from '@/config';
import { ICP_METADATA } from '@/constants';
import { useTokenSelectionChecker } from '@/hooks';
import { AppTokenMetadata } from '@/models';
import { selectSwapViewState, useAppSelector } from '@/store';

import { useSwapCanisterStore } from '..';

export const useSwapViewStore = () => {
  const state = useAppSelector(selectSwapViewState);
 
  const { from, tokenList } = state;
  const { allPairs } = useSwapCanisterStore();

  const { isTokenSelected: isICPSelected } = useTokenSelectionChecker({
    id0: from.metadata?.id,
  });

  const { isTokenSelected: isWICPSelected } = useTokenSelectionChecker({
    id0: from.metadata?.id,
    targetId: ENV.canistersPrincipalIDs.WICP,
  });

  const [fromTokenOptions, toTokenOptions] = useMemo(() => {
    if (!from.metadata || !tokenList) return [[], []];

    const fromTokenOptions = Object.values(tokenList);

    if (!allPairs) return [fromTokenOptions, []];

    if (isICPSelected) {
      const wicpTokenMetadata = tokenList[ENV.canistersPrincipalIDs.WICP];
      const xtcTokenMetadata = tokenList[ENV.canistersPrincipalIDs.XTC];
      const icpToTokenOptions: AppTokenMetadata[] = [
        ...(wicpTokenMetadata ? [wicpTokenMetadata] : []),
        ...(xtcTokenMetadata ? [xtcTokenMetadata] : []),
      ];
      return [fromTokenOptions, icpToTokenOptions];
    }
    const toTokenPathsIds = Object.keys(from.paths);
    const toTokenOptions = fromTokenOptions.filter((token) =>
      toTokenPathsIds.includes(token.id)
    );

    if (isWICPSelected) {
      const icpToken = fromTokenOptions.find((token) => token.id === ICP_METADATA.id);
      if (icpToken) { toTokenOptions.unshift({ ...icpToken });}
    }
    return [fromTokenOptions, toTokenOptions];
  }, [ from.metadata, from.paths, tokenList, allPairs, isICPSelected,isWICPSelected,
  ]);

  return { ...state, fromTokenOptions, toTokenOptions};
};
