import { useCallback, useEffect } from 'react';

import { FeatureState, useAppDispatch } from '@/store';
import { getICPPrice } from '@/utils/icp';

import { useKeepSync } from '../keep-sync';
import { priceActions, usePriceStore } from '.';
import { swapCanisterActions, useSwapCanisterStore } from '..';
import { ENV } from '@/config';

export const usePriceInit = () => {
  const {
    supportedTokenList,
    supportedTokenListState,
    allPairsState,
    allPairs,
  } = useSwapCanisterStore();
  const { state, icpPrice } = usePriceStore();

  const dispatch = useAppDispatch();

  useEffect(() => {
    _getICPPrice({ isRefreshing: false });
  }, []);

  useEffect(() => {
    if (
      icpPrice &&
      supportedTokenList &&
      supportedTokenListState !== FeatureState.Loading &&
      allPairsState !== FeatureState.Loading
    ) {
      const supportedTokenListWithPrices = supportedTokenList.map((token) => {
        let tokenPrice;

        if (token.id === ENV.canisterIds.WICP) {
          tokenPrice = icpPrice;
        }

        return {
          ...token,
          price: tokenPrice,
        };
      });

      dispatch(
        swapCanisterActions.setSupportedTokenList(supportedTokenListWithPrices)
      );
    }
  }, [icpPrice, supportedTokenListState, allPairsState]);

  const _getICPPrice = useKeepSync(
    'getICPPrice',
    useCallback(
      async (isRefreshing?: boolean) => {
        if (state !== FeatureState.Loading) {
          try {
            dispatch(
              priceActions.setState(
                isRefreshing ? FeatureState.Refreshing : FeatureState.Loading
              )
            );

            const price = await getICPPrice();

            if (price) {
              dispatch(priceActions.setPrice(price));
            } else {
              throw new Error('No "getICPPrice" response');
            }

            dispatch(priceActions.setState(FeatureState.Idle));

            return price;
          } catch (error) {
            console.error('getICPPrice: ', error);
            dispatch(priceActions.setState(FeatureState.Error));
          }
        }
      },
      [state]
    )
  );
};
