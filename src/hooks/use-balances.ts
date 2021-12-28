import { ENV, getFromStorage, saveToStorage } from '@/config';
import { SwapIDL, TokenIDL, WICPIDL } from '@/did';
import { ActorAdapter, appActors, useSwapActor } from '@/integrations/actor';
import { requestBalance } from '@/integrations/plug';
import { Balances } from '@/models';
import {
  FeatureState,
  swapCanisterActions,
  useAppDispatch,
  usePlugStore,
  useSwapCanisterStore,
} from '@/store';
import { useKeepSync } from '@/store/features/keep-sync';
import { parseResponseUserLPBalances } from '@/utils/canister';
import { Principal } from '@dfinity/principal';
import { useCallback, useMemo } from 'react';

export const useBalances = () => {
  const { principalId } = usePlugStore();
  const { sonicBalances, tokenBalances, balancesState, userLPBalancesState } =
    useSwapCanisterStore();
  const _swapActor = useSwapActor();

  const dispatch = useAppDispatch();

  const getUserPositiveLPBalances = useKeepSync(
    'getUserPositiveLPBalances',
    useCallback(
      async (isRefreshing?: boolean) => {
        try {
          if (userLPBalancesState === FeatureState.Loading) return;
          const swapActor =
            _swapActor ?? (appActors[ENV.canisterIds.swap] as SwapIDL.Factory);

          if (!swapActor) throw new Error('Swap actor not found');
          if (!principalId) throw new Error('Principal ID not found');

          dispatch(
            swapCanisterActions.setUserLPBalancesState(
              isRefreshing ? FeatureState.Refreshing : FeatureState.Loading
            )
          );
          const response = await swapActor.getUserLPBalancesAbove(
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

          dispatch(
            swapCanisterActions.setUserLPBalancesState(FeatureState.Idle)
          );
        } catch (error) {
          console.error('getUserLPBalancesAbove: ', error);
          dispatch(
            swapCanisterActions.setUserLPBalancesState(FeatureState.Error)
          );
        }
      },
      [_swapActor, userLPBalancesState, principalId]
    )
  );

  const getBalances = useKeepSync(
    'getBalances',
    useCallback(
      async (isRefreshing?: boolean) => {
        try {
          if (balancesState === FeatureState.Loading) return;

          const swapActor =
            _swapActor ?? (appActors[ENV.canisterIds.swap] as SwapIDL.Factory);

          if (!swapActor) throw new Error('Swap actor not found');
          if (!principalId) throw new Error('Principal ID not found');
          dispatch(
            swapCanisterActions.setBalancesState(
              isRefreshing ? FeatureState.Refreshing : FeatureState.Loading
            )
          );

          const sonicBalances = await swapActor.getUserBalances(
            Principal.fromText(principalId)
          );

          const tokenBalances = sonicBalances
            ? await Promise.all(
                sonicBalances.map(async (balance) => {
                  try {
                    const tokenCanisterId = balance[0];

                    const _interfaceFactory =
                      tokenCanisterId === ENV.canisterIds.WICP
                        ? WICPIDL.factory
                        : TokenIDL.factory;

                    const tokenActor: TokenIDL.Factory =
                      await new ActorAdapter().createActor(
                        tokenCanisterId,
                        _interfaceFactory
                      );

                    const storageKey = `${tokenCanisterId}-logo`;
                    const logo = getFromStorage(storageKey);

                    if (!logo) {
                      try {
                        const tokenLogo = await tokenActor.logo();
                        saveToStorage(storageKey, tokenLogo);
                      } catch (e) {
                        console.error('Token Logo not found', e);
                      }
                    }

                    const tokenBalance = await tokenActor.balanceOf(
                      Principal.fromText(principalId)
                    );

                    const result: [string, bigint] = [balance[0], tokenBalance];

                    return result;
                  } catch (error) {
                    console.error(error);
                    const errorResult: [string, bigint] = [
                      balance[0],
                      BigInt(0),
                    ];

                    return errorResult;
                  }
                })
              )
            : undefined;

          const plugResponse = (await requestBalance()) as unknown as any[];
          const icpBalance =
            plugResponse.find((balance) => balance.symbol === 'ICP')?.amount ??
            0;

          dispatch(swapCanisterActions.setICPBalance(icpBalance));
          dispatch(swapCanisterActions.setSonicBalances(sonicBalances));
          dispatch(swapCanisterActions.setTokenBalances(tokenBalances));
          dispatch(swapCanisterActions.setBalancesState(FeatureState.Idle));
        } catch (error) {
          console.error(error);
          dispatch(swapCanisterActions.setBalancesState(FeatureState.Error));
        }
      },
      [
        _swapActor,
        sonicBalances,
        tokenBalances,
        principalId,
        dispatch,
        balancesState,
      ]
    )
  );

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
