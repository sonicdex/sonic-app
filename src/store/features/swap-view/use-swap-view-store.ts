import { useMemo } from 'react';

import { ENV } from '@/config';
import { ICP_METADATA } from '@/constants';
import { AppTokenMetadata } from '@/models';
import { selectSwapViewState, useAppSelector } from '@/store';

import { useSwapCanisterStore } from '..';

export const useSwapViewStore = () => {
  const state = useAppSelector(selectSwapViewState);
  const { allPairs } = useSwapCanisterStore();

  const [fromTokenOptions, toTokenOptions] = useMemo(() => {
    if (!state.from.metadata || !state.tokenList) return [[], []];

    const fromTokenOptions = Object.values(state.tokenList);

    if (!allPairs) return [fromTokenOptions, []];

    if (state.from.metadata.id === ICP_METADATA.id) {
      const wicpTokenMetadata = fromTokenOptions.find(
        (token) => token.id === ENV.canisterIds.WICP
      );

      const xtcTokenMetadata = fromTokenOptions.find(
        (token) => token.id === ENV.canisterIds.XTC
      );

      const icpToTokenOptions: AppTokenMetadata[] = [
        ...(wicpTokenMetadata ? [wicpTokenMetadata] : []),
        ...(xtcTokenMetadata ? [xtcTokenMetadata] : []),
      ];

      return [fromTokenOptions, icpToTokenOptions];
    }

    const toTokenPathsIds = Object.keys(state.from.metadata.paths);
    const toTokenOptions = fromTokenOptions.filter((token) =>
      toTokenPathsIds.includes(token.id)
    );

    if (state.from.metadata.id === ENV.canisterIds.WICP) {
      const icpToken = fromTokenOptions.find(
        (token) => token.id === ICP_METADATA.id
      );

      if (icpToken) {
        toTokenOptions.unshift({ ...icpToken });
      }
    }

    return [fromTokenOptions, toTokenOptions];
  }, [state.tokenList, state.from.metadata, allPairs]);

  return {
    ...state,
    fromTokenOptions,
    toTokenOptions,
  };
};
