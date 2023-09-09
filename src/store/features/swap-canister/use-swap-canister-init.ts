import { useCallback, useEffect } from 'react';

import { useAllPairs } from '@/hooks';
import { useBalances } from '@/hooks/use-balances';

import { getswapActor } from '@/utils'

import { FeatureState, swapCanisterActions, useAppDispatch, useSwapCanisterStore , useWalletStore} from '@/store'; 
import { AppLog } from '@/utils';
import { parseResponseSupportedTokenList } from '@/utils/canister';

import { useKeepSync } from '../keep-sync';

export const useSwapCanisterInit = () => {
  const { getBalances, getUserPositiveLPBalances } = useBalances();
  const { principalId, isConnected, state: walletState } = useWalletStore();
  const { supportedTokenListState } = useSwapCanisterStore();
  const { getAllPairs } = useAllPairs();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isConnected) {
      dispatch(swapCanisterActions.setBalancesState(FeatureState.Idle));
    }
  }, [isConnected, walletState]);

  useEffect(() => {
    if (principalId) {
      getBalances({ isRefreshing: false });
      getUserPositiveLPBalances({ isRefreshing: false });
    }
  }, [principalId]);

  useEffect(() => {
    getSupportedTokenList({ isRefreshing: false });
    getAllPairs({ isRefreshing: false });
  }, []);

  const getSupportedTokenList = useKeepSync( 'getSupportedTokenList',
    useCallback(
      async (isRefreshing?: boolean , loadAction?:string) => {
        if (supportedTokenListState !== FeatureState.Loading) {
          try {
            dispatch( swapCanisterActions.setSupportedTokensListState( isRefreshing ? FeatureState.Updating : FeatureState.Loading));
            const swapActor = await getswapActor(true);
            const response = await swapActor?.getSupportedTokenList();
            if (response) {
              dispatch( swapCanisterActions.setSupportedTokenList( parseResponseSupportedTokenList(response)));
            } else {
              throw new Error('No "getSupportedTokenList" response');
            }
            dispatch( swapCanisterActions.setSupportedTokensListState(FeatureState.Idle));
            return response;
          } catch (error) {
            AppLog.error('Failed to fetch supported token list', error);
            dispatch( swapCanisterActions.setSupportedTokensListState( FeatureState.Error));
          }
        }
      },
      [supportedTokenListState]
    )
  );
};
