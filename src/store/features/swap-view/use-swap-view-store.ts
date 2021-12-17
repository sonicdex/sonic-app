import { selectSwapViewState, useAppSelector } from '@/store';
import { useMemo } from 'react';
import { useSwapCanisterStore } from '..';

export const useSwapViewStore = () => {
  const state = useAppSelector(selectSwapViewState);
  const { allPairs } = useSwapCanisterStore();

  const [fromTokenOptions, toTokenOptions] = useMemo(() => {
    if (!state.from.token || !state.tokenList) return [[], []];

    const tokenOptions = Object.values(state.tokenList);

    if (!allPairs) return [tokenOptions, []];

    return [
      tokenOptions,
      tokenOptions.filter((token) =>
        Boolean(
          allPairs![state.from.token!.id] &&
            allPairs![state.from.token!.id][token.id]
        )
      ),
    ];
  }, [state.tokenList, state.from.token, allPairs]);

  return {
    ...state,
    fromTokenOptions,
    toTokenOptions,
  };
};
