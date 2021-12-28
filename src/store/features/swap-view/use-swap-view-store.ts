import { ENV } from '@/config';
import { selectSwapViewState, useAppSelector } from '@/store';
import { useMemo } from 'react';
import { useSwapCanisterStore } from '..';

export const useSwapViewStore = () => {
  const state = useAppSelector(selectSwapViewState);
  const { allPairs } = useSwapCanisterStore();

  const [fromTokenOptions, toTokenOptions] = useMemo(() => {
    if (!state.from.metadata || !state.tokenList) return [[], []];

    const fromTokenOptions = Object.values(state.tokenList);

    if (!allPairs) return [fromTokenOptions, []];

    if (state.from.metadata.id === 'ICP') {
      const wicpToken = fromTokenOptions.find(
        (token) => token.id === ENV.canisterIds.WICP
      );

      const icpToTokenOptions = wicpToken ? [wicpToken] : undefined;

      return [fromTokenOptions, icpToTokenOptions];
    }

    const toTokenOptions = fromTokenOptions.filter((token) =>
      Boolean(allPairs?.[state.from.metadata!.id]?.[token.id])
    );

    if (state.from.metadata.id === ENV.canisterIds.WICP) {
      const icpToken = fromTokenOptions.find(
        (token) => token.id === ENV.canisterIds.WICP
      );

      if (icpToken) {
        toTokenOptions.push(icpToken);
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
