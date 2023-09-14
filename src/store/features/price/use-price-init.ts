import { toBigNumber } from '@sonicdex/sonic-js';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect } from 'react';

import { ENV } from '@/config';
import { FeatureState, useAppDispatch } from '@/store';
import { AppLog } from '@/utils';
import { fetchICPPrice } from '@/utils/icp';

import { swapCanisterActions, useSwapCanisterStore } from '..';
import { useKeepSync } from '../keep-sync';
import { priceActions, usePriceStore } from '.';

BigNumber; toBigNumber;

export const usePriceInit = () => {
  const { supportedTokenList, supportedTokenListState, allPairsState, allPairs } = useSwapCanisterStore();

  const { state, icpPrice } = usePriceStore();
  const dispatch = useAppDispatch();

  useEffect(() => { _getICPPrice({ isRefreshing: false }) }, []);

  useEffect(() => {
    if (icpPrice && supportedTokenList && allPairs && supportedTokenListState !== FeatureState.Loading && allPairsState !== FeatureState.Loading) {

      const supportedTokenListWithPrices = supportedTokenList.map((token) => {
        let tokenPrice;
        if (token.id === ENV.canistersPrincipalIDs.WICP || token.id === ENV.canistersPrincipalIDs.ledger) {
           tokenPrice = icpPrice; }
        else {

          var BaseTokenPair = allPairs?.[ENV.canistersPrincipalIDs.WICP]?.[token.id];
          if(!BaseTokenPair) BaseTokenPair = allPairs?.[ENV.canistersPrincipalIDs.ledger]?.[token.id];

          const tokenDecimals = supportedTokenList.find(({ id }) => id === token.id)?.decimals;
          
          const BaseTokenDecimals = supportedTokenList.find(({ id }) => id === ENV.canistersPrincipalIDs.ledger)?.decimals;

          if (BaseTokenPair && tokenDecimals && BaseTokenDecimals) {
            const baseReserve = BaseTokenPair.token0 === ENV.canistersPrincipalIDs.WICP || BaseTokenPair.token0 === ENV.canistersPrincipalIDs.ledger ?
              BaseTokenPair.reserve0 : BaseTokenPair.reserve1;

            const tokenReserve = BaseTokenPair.token0 === ENV.canistersPrincipalIDs.WICP || BaseTokenPair.token0 === ENV.canistersPrincipalIDs.ledger ?
              BaseTokenPair.reserve1 : BaseTokenPair.reserve0;

              if (baseReserve && tokenReserve) {
                tokenPrice = new BigNumber(icpPrice).multipliedBy(toBigNumber(baseReserve).applyDecimals(BaseTokenDecimals))
                 .div(toBigNumber(tokenReserve).applyDecimals(tokenDecimals)).toString();
              }
          }else {
            tokenPrice = '0';
        }
        }
        return {...token,price: tokenPrice};
      });
      dispatch(swapCanisterActions.setSupportedTokenList(supportedTokenListWithPrices));
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
                isRefreshing ? FeatureState.Updating : FeatureState.Loading
              )
            );

            const price = await fetchICPPrice();

            if (price) {
              dispatch(priceActions.setPrice(price));
            } else {
              throw new Error('No "getICPPrice" response');
            }

            dispatch(priceActions.setState(FeatureState.Idle));

            return price;
          } catch (error) {
            AppLog.error('ICP price fetch error', error);
            dispatch(priceActions.setState(FeatureState.Error));
          }
        }
      },
      [dispatch, state]
    )
  );
};
