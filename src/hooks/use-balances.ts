import { useMemo } from 'react';

import { Balances } from '@/models';
import {
  FeatureState,
  swapActions,
  useAppDispatch,
  usePlugStore,
  useSwapStore,
} from '@/store';
import { ActorAdapter, useSwapActor } from '@/integrations/actor';
import { Principal } from '@dfinity/principal';
import { TokenIDL } from '@/did';

export const useTotalBalances = () => {
  const { principalId } = usePlugStore();
  const { sonicBalances, tokenBalances } = useSwapStore();
  const swapActor = useSwapActor();

  const dispatch = useAppDispatch();

  async function getBalances() {
    console.log(swapActor);
    try {
      dispatch(swapActions.setBalancesState(FeatureState.Loading));

      if (principalId) {
        const sonicBalances = await swapActor?.getUserBalances(
          Principal.fromText(principalId)
        );

        const tokensBalances = sonicBalances
          ? await Promise.all(
              sonicBalances.map(async (balance) => {
                try {
                  const tokenActor: TokenIDL.Factory =
                    await new ActorAdapter().createActor(
                      balance[0],
                      TokenIDL.factory
                    );

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

        dispatch(swapActions.setSonicBalances(sonicBalances));
        dispatch(swapActions.setTokenBalances(tokensBalances));
        dispatch(swapActions.setBalancesState(FeatureState.Idle));
      }
    } catch (error) {
      console.error(error);
      dispatch(swapActions.setBalancesState(FeatureState.Error));
    }
  }

  const totalBalances = useMemo(() => {
    if (tokenBalances && sonicBalances) {
      return sumBalances(tokenBalances, sonicBalances);
    }

    return undefined;
  }, [tokenBalances, sonicBalances]);

  return {
    totalBalances,
    getBalances,
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
