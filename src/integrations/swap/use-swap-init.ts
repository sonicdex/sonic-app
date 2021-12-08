import { useEffect } from 'react';

import {
  FeatureState,
  liquidityViewActions,
  plugActions,
  swapActions,
  swapViewActions,
  useAppDispatch,
  usePlugStore,
} from '@/store';
import { plug } from '../plug';
import { useSwapActor } from '../actor/use-swap-actor';
import { Principal } from '@dfinity/principal';
import { parseResponseTokenList } from '@/utils/canister';

export const useSwapInit = () => {
  const { isConnected, principalId } = usePlugStore();

  const swapActor = useSwapActor();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (swapActor && principalId) {
      getSonicBalances();
    }
  }, [isConnected]);

  useEffect(() => {
    if (plug && isConnected) {
      getPlugBalance();
    }
  }, [plug, isConnected]);

  useEffect(() => {
    if (swapActor && principalId) {
      swapActor
        .getUserBalances(Principal.fromText(principalId))
        .then((response) => dispatch(swapActions.setBalance(response)));
    }
  }, [swapActor, principalId]);

  useEffect(() => {
    getSupportedTokenList();
  }, [swapActor]);

  async function getSonicBalances() {
    try {
      dispatch(swapActions.setState(FeatureState.Loading));

      if (principalId) {
        const balance = await swapActor?.getUserBalances(
          Principal.fromText(principalId)
        );
        dispatch(swapActions.setBalance(balance));
      }
    } catch (error) {
      console.error(error);
    }
  }

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
};
