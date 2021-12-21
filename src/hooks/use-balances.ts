import { ENV, getFromStorage, saveToStorage } from '@/config';
import { SwapIDL, TokenIDL } from '@/did';
import { ActorAdapter, appActors, useSwapActor } from '@/integrations/actor';
import { Balances } from '@/models';
import {
  FeatureState,
  swapCanisterActions,
  useAppDispatch,
  usePlugStore,
  useSwapCanisterStore,
} from '@/store';
import { parseResponseUserLPBalances } from '@/utils/canister';
import { Principal } from '@dfinity/principal';
import { useCallback, useMemo } from 'react';

export const useBalances = () => {
  const { principalId } = usePlugStore();
  const { sonicBalances, tokenBalances } = useSwapCanisterStore();
  const _swapActor = useSwapActor();

  const dispatch = useAppDispatch();

  async function getUserPositiveLPBalances() {
    if (_swapActor && principalId) {
      try {
        const swapActor =
          _swapActor ?? (appActors[ENV.canisterIds.swap] as SwapIDL.Factory);

        if (!swapActor) throw new Error('Swap actor not found');
        if (!principalId) throw new Error('Principal ID not found');

        dispatch(
          swapCanisterActions.setUserLPBalancesState(FeatureState.Loading)
        );
        const response = await _swapActor.getUserLPBalancesAbove(
          Principal.fromText(principalId),
          BigInt(0)
        );

        if (response) {
          dispatch(
            swapCanisterActions.setUserLPBalances(
              parseResponseUserLPBalances(response)
            )
          );
        } else {
          throw new Error('No "getUserLPBalancesAbove" response');
        }

        dispatch(swapCanisterActions.setUserLPBalancesState(FeatureState.Idle));
      } catch (error) {
        console.error('getUserLPBalancesAbove: ', error);
        dispatch(
          swapCanisterActions.setUserLPBalancesState(FeatureState.Error)
        );
      }
    }
  }

  const getBalances = useCallback(async () => {
    try {
      const swapActor =
        _swapActor ?? (appActors[ENV.canisterIds.swap] as SwapIDL.Factory);

      if (!swapActor) throw new Error('Swap actor not found');
      if (!principalId) throw new Error('Principal ID not found');
      dispatch(swapCanisterActions.setBalancesState(FeatureState.Loading));

      const sonicBalances = await swapActor.getUserBalances(
        Principal.fromText(principalId)
      );

      const tokenBalances = sonicBalances
        ? await Promise.all(
            sonicBalances.map(async (balance) => {
              try {
                const tokenCanisterId = balance[0];

                const tokenActor: TokenIDL.Factory =
                  await new ActorAdapter().createActor(
                    tokenCanisterId,
                    TokenIDL.factory
                  );

                const storageKey = `${tokenCanisterId}-logo`;
                const logo = getFromStorage(storageKey);

                if (!logo) {
                  const tokenLogo = await tokenActor.getLogo();

                  saveToStorage(storageKey, tokenLogo);
                }

                const tokenBalance = await tokenActor.balanceOf(
                  Principal.fromText(principalId)
                );

                const result: [string, bigint] = [balance[0], tokenBalance];

                return result;
              } catch (error) {
                console.error(error);
                const errorResult: [string, bigint] = [balance[0], BigInt(0)];

                return errorResult;
              }
            })
          )
        : undefined;

      dispatch(swapCanisterActions.setSonicBalances(sonicBalances));
      dispatch(swapCanisterActions.setTokenBalances(tokenBalances));
      dispatch(swapCanisterActions.setBalancesState(FeatureState.Idle));
    } catch (error) {
      console.error(error);
      dispatch(swapCanisterActions.setBalancesState(FeatureState.Error));
    }
  }, [_swapActor, sonicBalances, tokenBalances, principalId, dispatch]);

  const totalBalances = useMemo(() => {
    if (tokenBalances && sonicBalances) {
      return sumBalances(tokenBalances, sonicBalances);
    }

    return undefined;
  }, [tokenBalances, sonicBalances]);

  return {
    totalBalances,
    sonicBalances,
    tokenBalances,
    getBalances,
    getUserPositiveLPBalances,
  };
};

// === UTILS ===

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
