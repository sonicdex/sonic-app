import BigNumber from 'bignumber.js';
import { useCallback, useEffect } from 'react';

import { ENV } from '@/config';
import { FeatureState, useAppDispatch } from '@/store';
import { getICPPrice } from '@/utils/icp';

import { swapCanisterActions, useSwapCanisterStore } from '..';
import { useKeepSync } from '../keep-sync';
import { priceActions, usePriceStore } from '.';

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
      allPairs &&
      supportedTokenListState !== FeatureState.Loading &&
      allPairsState !== FeatureState.Loading
    ) {
      const supportedTokenListWithPrices = supportedTokenList.map((token) => {
        let tokenPrice;

        if (token.id === ENV.canisterIds.WICP) {
          tokenPrice = icpPrice;
        }

        if (token.id !== ENV.canisterIds.WICP) {
          const wicpTokenPair = allPairs?.[ENV.canisterIds.WICP]?.[token.id];

          if (wicpTokenPair) {
            const wicpReserve =
              wicpTokenPair.token0 === ENV.canisterIds.WICP
                ? wicpTokenPair.reserve0
                : wicpTokenPair.reserve1;

            const tokenReserve =
              wicpTokenPair.token0 === ENV.canisterIds.WICP
                ? wicpTokenPair.reserve1
                : wicpTokenPair.reserve0;

            if (wicpReserve && tokenReserve) {
              tokenPrice = new BigNumber(icpPrice)
                .multipliedBy(wicpReserve.toString())
                .div(tokenReserve.toString())
                .toString();
            }
          } else {
            tokenPrice = '0';
          }
        }

        console.log('price', allPairs);

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
