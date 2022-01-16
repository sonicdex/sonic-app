import BigNumber from 'bignumber.js';
import { useCallback, useEffect } from 'react';

import { ENV } from '@/config';
import { FeatureState, useAppDispatch } from '@/store';
import { getCurrency } from '@/utils/format';
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

        if (token.id === ENV.canistersPrincipalIDs.WICP) {
          tokenPrice = icpPrice;
        }

        if (token.id !== ENV.canistersPrincipalIDs.WICP) {
          const wicpToTokenPair =
            allPairs?.[ENV.canistersPrincipalIDs.WICP]?.[token.id];
          const tokenDecimals = supportedTokenList.find(
            ({ id }) => id === token.id
          )?.decimals;
          const wicpDecimals = supportedTokenList.find(
            ({ id }) => id === ENV.canistersPrincipalIDs.WICP
          )?.decimals;

          if (wicpToTokenPair && tokenDecimals && wicpDecimals) {
            const wicpReserve =
              wicpToTokenPair.token0 === ENV.canistersPrincipalIDs.WICP
                ? wicpToTokenPair.reserve0
                : wicpToTokenPair.reserve1;

            const tokenReserve =
              wicpToTokenPair.token0 === ENV.canistersPrincipalIDs.WICP
                ? wicpToTokenPair.reserve1
                : wicpToTokenPair.reserve0;

            if (wicpReserve && tokenReserve) {
              tokenPrice = new BigNumber(icpPrice)
                .multipliedBy(getCurrency(wicpReserve.toString(), wicpDecimals))
                .div(getCurrency(tokenReserve.toString(), tokenDecimals))
                .toString();
            }
          } else {
            tokenPrice = '0';
          }
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
  }, [icpPrice, supportedTokenListState, allPairsState, dispatch, allPairs]);

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
      [dispatch, state]
    )
  );
};
