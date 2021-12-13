import { selectSwapViewState, useAppSelector } from '@/store';
import { useMemo } from 'react';

export const useSwapViewStore = () => {
  const state = useAppSelector(selectSwapViewState);

  const [fromTokenOptions, toTokenOptions] = useMemo(() => {
    if (!state.from.token || !state.tokenList) return [[], []];

    const tokenOptions = Object.values(state.tokenList);

    if (!state.pairList) return [tokenOptions, []];

    return [
      tokenOptions,
      tokenOptions.filter((token) =>
        Boolean(
          state.pairList![state.from.token!.id] &&
            state.pairList![state.from.token!.id][token.id]
        )
      ),
    ];
  }, [state.tokenList, state.from.token, state.pairList]);

  return {
    ...state,
    fromTokenOptions,
    toTokenOptions,
  };
};
