import { useCallback, useEffect } from 'react';

import { useBalances } from '@/hooks/use-balances';
import {
  FeatureState,
  swapCanisterActions,
  useAppDispatch,
  usePlugStore,
  useSwapCanisterStore,
} from '@/store';
import {
  parseResponseAllPairs,
  parseResponseSupportedTokenList,
} from '@/utils/canister';

import { useSwapActor } from '../../../integrations/actor/use-swap-actor';
import { useKeepSync } from '../keep-sync';

export const useSwapCanisterInit = () => {
  const { getBalances, getUserPositiveLPBalances } = useBalances();
  const { principalId, isConnected, state: plugState } = usePlugStore();
  const { supportedTokenListState, allPairsState } = useSwapCanisterStore();

  const swapActor = useSwapActor();

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
    if (swapActor && principalId) {
      getBalances({ isRefreshing: false });
      getUserPositiveLPBalances({ isRefreshing: false });
    }
  }, [swapActor, principalId]);

  useEffect(() => {
    getSupportedTokenList({ isRefreshing: false, interval: 5 * 1000 });
    getAllPairs({ isRefreshing: false, interval: 5 * 1000 });
  }, [swapActor]);

  const getSupportedTokenList = useKeepSync(
    'getSupportedTokenList',
    useCallback(
      async (isRefreshing?: boolean) => {
        if (swapActor && supportedTokenListState !== FeatureState.Loading) {
          try {
            dispatch(
              swapCanisterActions.setSupportedTokensListState(
                isRefreshing ? FeatureState.Refreshing : FeatureState.Loading
              )
            );

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
            console.error('getSupportedTokenList: ', error);
            dispatch(
              swapCanisterActions.setSupportedTokensListState(
                FeatureState.Error
              )
            );
          }
        }
      },
      [swapActor, supportedTokenListState]
    )
  );

  const getAllPairs = useKeepSync(
    'getAllPairs',
    useCallback(
      async (isRefreshing?: boolean) => {
        if (swapActor && allPairsState !== FeatureState.Loading) {
          try {
            dispatch(
              swapCanisterActions.setAllPairsState(
                isRefreshing ? FeatureState.Refreshing : FeatureState.Loading
              )
            );
            const response = await swapActor.getAllPairs();

            if (response) {
              dispatch(
                swapCanisterActions.setAllPairs(parseResponseAllPairs(response))
              );
            } else {
              throw new Error('No "getAllPairs" response');
            }

            dispatch(swapCanisterActions.setAllPairsState(FeatureState.Idle));
          } catch (error) {
            console.error('getAllPairs: ', error);
            dispatch(swapCanisterActions.setAllPairsState(FeatureState.Error));
          }
        }
      },
      [swapActor, allPairsState]
    )
  );
};
