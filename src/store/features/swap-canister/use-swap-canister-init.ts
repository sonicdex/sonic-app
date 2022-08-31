import { useCallback, useEffect } from 'react';

import { useAllPairs } from '@/hooks';
import { useBalances } from '@/hooks/use-balances';
import { createAnonSwapActor } from '@/integrations/actor';
import {
  FeatureState,
  swapCanisterActions,
  useAppDispatch,
  usePlugStore,
  useSwapCanisterStore,
} from '@/store';
import { AppLog } from '@/utils';
import { parseResponseSupportedTokenList } from '@/utils/canister';

import { useKeepSync } from '../keep-sync';

export const useSwapCanisterInit = () => {
  const { getBalances, getUserPositiveLPBalances } = useBalances();
  const { principalId, isConnected, state: plugState } = usePlugStore();
  const { supportedTokenListState } = useSwapCanisterStore();
  const { getAllPairs } = useAllPairs();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      !isConnected &&
      (plugState === FeatureState.Error || plugState === FeatureState.Idle)
    ) {
      dispatch(swapCanisterActions.setBalancesState(FeatureState.Idle));
    }
  }, [isConnected, plugState]);

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

  const getSupportedTokenList = useKeepSync(
    'getSupportedTokenList',
    useCallback(
      async (isRefreshing?: boolean) => {
        if (supportedTokenListState !== FeatureState.Loading) {
          try {
            dispatch(
              swapCanisterActions.setSupportedTokensListState(
                isRefreshing ? FeatureState.Updating : FeatureState.Loading
              )
            );

            const swapActor = await createAnonSwapActor();
            const response = await swapActor.getSupportedTokenList();

            if (response) {
              dispatch(
                swapCanisterActions.setSupportedTokenList(
                  parseResponseSupportedTokenList(response)
                )
              );
            } else {
              throw new Error('No "getSupportedTokenList" response');
            }

            dispatch(
              swapCanisterActions.setSupportedTokensListState(FeatureState.Idle)
            );

            return response;
          } catch (error) {
            AppLog.error('Failed to fetch supported token list', error);
            dispatch(
              swapCanisterActions.setSupportedTokensListState(
                FeatureState.Error
              )
            );
          }
        }
      },
      [supportedTokenListState]
    )
  );
};

