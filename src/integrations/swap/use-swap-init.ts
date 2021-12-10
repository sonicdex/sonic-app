import { useTotalBalances } from '@/hooks/use-balances';
import {
  FeatureState,
  liquidityViewActions,
  swapActions,
  swapViewActions,
  useAppDispatch,
  usePlugStore,
} from '@/store';
import {
  parseResponseAllPairs,
  parseResponseTokenList,
} from '@/utils/canister';
import { useEffect } from 'react';
import { useSwapActor } from '../actor/use-swap-actor';

export const useSwapInit = () => {
  const { getBalances } = useTotalBalances();
  const { principalId } = usePlugStore();

  const swapActor = useSwapActor();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (swapActor && principalId) {
      getBalances();
    }
  }, [swapActor, principalId]);

  useEffect(() => {
    getSupportedTokenList();
    getAllPairs();
  }, [swapActor]);

  async function getSupportedTokenList() {
    if (swapActor) {
      try {
        dispatch(swapActions.setState(FeatureState.Loading));

        const response = await swapActor.getSupportedTokenList();

        if (response) {
          dispatch(
            swapViewActions.setTokenList(parseResponseTokenList(response))
          );
          dispatch(
            liquidityViewActions.setTokenList(parseResponseTokenList(response))
          );
          dispatch(swapActions.setSupportedTokenList(response));
        }
        dispatch(swapActions.setState(FeatureState.Idle));

        return response;
      } catch (error) {
        console.log(error);
        dispatch(swapActions.setState(FeatureState.Error));
      }
    }
  }

  async function getAllPairs() {
    if (swapActor) {
      try {
        const response = await swapActor.getAllPairs();

        if (response) {
          dispatch(
            swapViewActions.setPairList(parseResponseAllPairs(response))
          );
        }
        dispatch(swapViewActions.setState(FeatureState.Idle));
      } catch (error) {
        console.log(error);
        dispatch(swapViewActions.setState(FeatureState.Error));
      }
    }
  }
};
