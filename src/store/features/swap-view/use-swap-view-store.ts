import { selectSwapViewState, useAppSelector } from '@/store';
import { useMemo } from 'react';

export const useSwapViewStore = () => {
  const state = useAppSelector(selectSwapViewState);

  const [fromTokenOptions, toTokenOptions] = useMemo(() => {
    if (!state.from.token || !state.tokenList) return [[], []];

    const tokenOptions = Object.values(state.tokenList);

    return [
      tokenOptions,
      tokenOptions.filter((token) => token.id !== state.from.token?.id),
    ];
  }, [state.tokenList, state.from.token]);

  return {
    ...state,
    fromTokenOptions,
    toTokenOptions,
  };
};
