import { useBalances } from '@/hooks/use-balances';
import { useKeepSync } from '@/hooks/use-keep-sync';
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
import { useEffect } from 'react';
import { useSwapActor } from '../../../integrations/actor/use-swap-actor';

export const useSwapCanisterInit = () => {
  const { getBalances, getUserPositiveLPBalances, totalBalances } =
    useBalances();
  const { principalId, isConnected, state: plugState } = usePlugStore();
  const { supportedTokenListState } = useSwapCanisterStore();

  const tokenListKeepSync = useKeepSync(getSupportedTokenList);
  const allPairsKeepSync = useKeepSync(getAllPairs);
  const balancesKeepSync = useKeepSync(() =>
    getBalances().then(() => balancesKeepSync())
  );

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
    if (
      swapActor &&
      principalId &&
      supportedTokenListState !== FeatureState.Loading
    ) {
      getBalances();
      getUserPositiveLPBalances();
    }
  }, [swapActor, principalId, supportedTokenListState]);

  useEffect(() => {
    getSupportedTokenList();
    getAllPairs();
  }, [swapActor]);

  useEffect(() => {
    if (swapActor && totalBalances) {
      getAllPairs();
    }
  }, [totalBalances, swapActor]);

  async function getSupportedTokenList() {
    if (swapActor) {
      try {
        dispatch(
          swapCanisterActions.setSupportedTokensListState(FeatureState.Loading)
        );

        const response = await swapActor.getSupportedTokenList();

        if (response) {
          dispatch(
            swapCanisterActions.setSupportedTokenList(
              parseResponseSupportedTokenList(response)
            )
          );
        }
        tokenListKeepSync();
        dispatch(
          swapCanisterActions.setSupportedTokensListState(FeatureState.Idle)
        );

        return response;
      } catch (error) {
        console.error('getSupportedTokenList: ', error);
        dispatch(
          swapCanisterActions.setSupportedTokensListState(FeatureState.Error)
        );
      }
    }
  }

  async function getAllPairs() {
    if (swapActor) {
      try {
        dispatch(swapCanisterActions.setAllPairsState(FeatureState.Loading));
        const response = await swapActor.getAllPairs();

        if (response) {
          dispatch(
            swapCanisterActions.setAllPairs(parseResponseAllPairs(response))
          );
        } else {
          throw new Error('No "getAllPairs" response');
        }

        allPairsKeepSync();
        dispatch(swapCanisterActions.setAllPairsState(FeatureState.Idle));
      } catch (error) {
        console.error('getAllPairs: ', error);
        dispatch(swapCanisterActions.setAllPairsState(FeatureState.Error));
      }
    }
  }
};
