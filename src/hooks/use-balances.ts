import { Principal } from '@dfinity/principal';
import { useCallback, useMemo } from 'react';

import { ICP_METADATA } from '@/constants';

import { Balances } from '@/models';
import {
  FeatureState, swapCanisterActions, useAppDispatch, useSwapCanisterStore, useWalletStore
} from '@/store';

import { useKeepSync } from '@/store/features/keep-sync';
import { AppLog } from '@/utils';
import { parseResponseUserLPBalances } from '@/utils/canister';

import { parseAmount, roundBigInt } from '@/utils/format';
import { fetchICPBalance } from '@/utils/icp';

import { getswapActor, getTokenBalance, tokenList } from '@/utils'

export const useBalances = () => {
  const { principalId } = useWalletStore();

  const { sonicBalances, icpBalance, tokenBalances, balancesState, userLPBalancesState } = useSwapCanisterStore();

  const dispatch = useAppDispatch();

  const getUserPositiveLPBalances = useKeepSync('getUserPositiveLPBalances',
    useCallback(
      async (isRefreshing?: boolean) => {
        try {
          if (userLPBalancesState === FeatureState.Loading) return;
          dispatch(swapCanisterActions.setUserLPBalancesState(isRefreshing ? FeatureState.Updating : FeatureState.Loading));
          if (!principalId) throw new Error('Principal ID not found');

          const swapActor = await getswapActor(true);
          const response = await swapActor.getUserLPBalancesAbove(Principal.fromText(principalId), BigInt(0));

          if (response) {
            dispatch(swapCanisterActions.setUserLPBalances(parseResponseUserLPBalances(response)));
          } else {
            throw new Error('No "getUserLPBalancesAbove" response');
          }
          dispatch(swapCanisterActions.setUserLPBalancesState(FeatureState.Idle));
        } catch (error) {
          AppLog.error(`User LP balances fetch error`, error);
          // dispatch(swapCanisterActions.setUserLPBalancesState(FeatureState.Error));
        }
      },
      [userLPBalancesState, principalId, dispatch]
    )
  );
  const maxDecimalPlaces = 5;
  const getBalances = useKeepSync('getBalances', useCallback(async (isRefreshing?: boolean) => {
    try {
      if (balancesState === FeatureState.Loading) return;
      if (!principalId) return;
      const tokenInfo = tokenList('obj');
      dispatch(swapCanisterActions.setBalancesState(isRefreshing ? FeatureState.Updating : FeatureState.Loading));
      const swapActor: any = await getswapActor(true);
      const sonicBalances = await swapActor.getUserBalances(Principal.fromText(principalId));
      const tokenBalances = sonicBalances ? await Promise.all(
        sonicBalances.map(async (balance: any, index: number) => {
          const tokenCanisterId = balance[0];
          
          var tokenFeeLen = tokenInfo[tokenCanisterId]?.fee.toString().length;
          var tokenDecimals = tokenInfo[tokenCanisterId]?.decimals;


          sonicBalances[index][1] = roundBigInt(sonicBalances[index][1], tokenDecimals, tokenFeeLen > maxDecimalPlaces ? tokenFeeLen : maxDecimalPlaces);
          try {
            var tokenBalance = BigInt(0);
            tokenBalance = await getTokenBalance(tokenCanisterId, principalId);
            const result: [string, bigint] = [balance[0], roundBigInt(tokenBalance, tokenDecimals, tokenFeeLen > maxDecimalPlaces ? tokenFeeLen : maxDecimalPlaces)];
            return result;
          } catch (error) {
           // AppLog.error(`Token balance fetch error: token="${tokenCanisterId}"`, error);
            const errorResult: [string, bigint] = [balance[0], BigInt(0)];
            return errorResult;
          }
        })
      ) : undefined;
      const icpBalance = await fetchICPBalance(principalId);
      dispatch(swapCanisterActions.setICPBalance(parseAmount(icpBalance, ICP_METADATA.decimals)));
      dispatch(swapCanisterActions.setSonicBalances(sonicBalances));
      dispatch(swapCanisterActions.setTokenBalances(tokenBalances));
      dispatch(swapCanisterActions.setBalancesState(FeatureState.Idle));
    } catch (error) {
      AppLog.error(`Balances fetch error`, error);
      dispatch(swapCanisterActions.setBalancesState(FeatureState.Error));
    }
  }, [principalId, dispatch, balancesState]), { interval: 10 * 1000 }
  );

  const totalBalances = useMemo(() => {
    if (tokenBalances && sonicBalances) {
      return sumBalances(tokenBalances, sonicBalances, { [ICP_METADATA.id]: icpBalance ?? 0 });
    }
    return undefined;
  }, [tokenBalances, sonicBalances, icpBalance, principalId]);

  return {
    totalBalances, sonicBalances, tokenBalances, icpBalance, balancesState,
    userLPBalancesState, getBalances, getUserPositiveLPBalances,
  };
};

const sumBalances = (...balances: Balances[]): Balances => {
  return balances.reduce((acc, current) => {
    const balance = Object.entries(current);
    balance.forEach(([canisterId, amount]) => {
      if (acc[canisterId]) {
        acc[canisterId] += amount;
      } else {
        acc[canisterId] = amount;
      }
    });
    return acc;
  }, {} as Balances);
};
