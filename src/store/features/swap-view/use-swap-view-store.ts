import { selectSwapViewState, swapViewActions, useAppDispatch } from '@/store';

import { useAppSelector } from '@/store';
import { useEffect, useMemo } from 'react';

export const useSwapViewStore = () => {
  const state = useAppSelector(selectSwapViewState);
  const dispatch = useAppDispatch();

  const [fromTokenOptions, toTokenOptions] = useMemo(() => {
    if (!state.from.token || !state.tokenList) return [[], []];

    const tokenOptions = Object.values(state.tokenList);

    return [
      tokenOptions,
      tokenOptions.filter((token) => token.id !== state.from.token?.id),
    ];
  }, [state.tokenList, state.from.token]);

  useEffect(() => {
    if (!state.from.token || !state.tokenList) return;

    if (state.from.token?.id === state.to.token?.id) {
      dispatch(
        swapViewActions.setToken({
          data: 'to',
          tokenId: toTokenOptions.find(
            (token) => token.id !== state.from.token?.id
          )?.id,
        })
      );
    }
  }, [state.from.token]);

  return {
    ...state,
    fromTokenOptions,
    toTokenOptions,
  };
};
