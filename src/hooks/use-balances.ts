import { Principal } from '@dfinity/principal';
import { useCallback, useMemo } from 'react';

import { ENV, getFromStorage, saveToStorage } from '@/config';
import { ICP_METADATA } from '@/constants';
import { SwapIDL, TokenIDL } from '@/did';
import { XTCIDL } from '@/did/sonic/xtc.did';
import { ActorAdapter, appActors, useSwapActor } from '@/integrations/actor';
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
import { parseAmount } from '@/utils/format';
import { getICPBalance } from '@/utils/icp';

export const useBalances = () => {
  const { principalId } = usePlugStore();
  const {
    sonicBalances,
    icpBalance,
    tokenBalances,
    balancesState,
    userLPBalancesState,
  } = useSwapCanisterStore();
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
      [_swapActor, userLPBalancesState, principalId, dispatch]
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

                    // FIXME: When XTC will be more compatible with DIP20
                    // we can remove XTCIDL factory
                    const _interfaceFactory =
                      tokenCanisterId === ENV.canisterIds.XTC
                        ? XTCIDL.factory
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

          const icpBalance = await getICPBalance(principalId);

          dispatch(
            swapCanisterActions.setICPBalance(
              parseAmount(icpBalance, ICP_METADATA.decimals)
            )
          );
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
    icpBalance,
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
