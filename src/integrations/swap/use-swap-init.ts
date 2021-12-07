import { useEffect } from 'react';

import { useActorStore } from '@/store/features/actor';
import {
  FeatureState,
  plugActions,
  swapActions,
  useAppDispatch,
  usePlugStore,
} from '@/store';
import { plug } from '../plug';

export const useSwapInit = () => {
  const { actors } = useActorStore();
  const { isConnected } = usePlugStore();
  const { swap: swapActor } = actors;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isConnected) {
      getPlugBalance();
    }
  }, [isConnected]);

  useEffect(() => {
    getSupportedTokenList();
  }, [swapActor]);

  async function getPlugBalance() {
    try {
      dispatch(plugActions.setState(FeatureState.Loading));
      const balance = await plug?.requestBalance();

      dispatch(plugActions.setBalance(balance));
    } catch (error) {
      console.error(error);
    }
  }

  async function getSupportedTokenList() {
    if (swapActor) {
      try {
        dispatch(swapActions.setState(FeatureState.Loading));

        const response = await swapActor.getSupportedTokenList();

        if (response) {
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
};
