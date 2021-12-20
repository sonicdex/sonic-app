import { selectSwapViewState, useAppSelector } from '@/store';
import { useMemo } from 'react';
import { useSwapCanisterStore } from '..';

export const useSwapViewStore = () => {
  const state = useAppSelector(selectSwapViewState);
  const { allPairs } = useSwapCanisterStore();

  const [fromTokenOptions, toTokenOptions] = useMemo(() => {
    if (!state.from.metadata || !state.tokenList) return [[], []];

    const tokenOptions = Object.values(state.tokenList);

    if (!allPairs) return [tokenOptions, []];

    return [
      tokenOptions,
      tokenOptions.filter((token) =>
        Boolean(
          allPairs![state.from.metadata!.id] &&
            allPairs![state.from.metadata!.id][token.id]
        )
      ),
    ];
  }, [state.tokenList, state.from.metadata, allPairs]);

  return {
    ...state,
    fromTokenOptions,
    toTokenOptions,
  };
};
