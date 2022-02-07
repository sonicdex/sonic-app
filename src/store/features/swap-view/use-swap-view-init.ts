import { useEffect } from 'react';

import { getICPTokenMetadata } from '@/constants';
import { useAppDispatch } from '@/store';
import { parseResponseTokenList } from '@/utils/canister';

import { usePriceStore, useSwapCanisterStore } from '..';
import { swapViewActions } from '.';

export const useSwapView = () => {
  const dispatch = useAppDispatch();
  const { icpPrice } = usePriceStore();
  const { allPairs, supportedTokenList } = useSwapCanisterStore();

  useEffect(() => {
    if (!supportedTokenList) return;

    const tokenList = parseResponseTokenList([
      getICPTokenMetadata(icpPrice),
      ...supportedTokenList,
    ]);
    dispatch(swapViewActions.setTokenList(tokenList));
  }, [dispatch, icpPrice, supportedTokenList]);

  useEffect(() => {
    dispatch(swapViewActions.setAllPairs(allPairs));
  }, [allPairs, dispatch]);
};
