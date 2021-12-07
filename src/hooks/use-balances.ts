import { useSwapActor } from '@/integrations/actor/use-swap-actor';
import { Balance } from '@/models';
import {
  plugActions,
  swapActions,
  useAppDispatch,
  usePlugStore,
  useSwapStore,
} from '@/store';
import { Principal } from '@dfinity/principal';
import { useEffect, useMemo } from 'react';
import { plug } from '../integrations/plug';

export const useBalances = () => {
  const swapActor = useSwapActor();
  const { isConnected, principalId, balance: plugBalance } = usePlugStore();
  const { balances: sonicBalance } = useSwapStore();

  const dispatch = useAppDispatch();

  const totalBalance = useMemo(() => {
    if (plugBalance && sonicBalance) {
      return sumBalances(plugBalance, sonicBalance);
    }

    return undefined;
  }, [plugBalance, sonicBalance]);

  useEffect(() => {
    if (plug && isConnected) {
      plug
        .requestBalance()
        .then((response) => dispatch(plugActions.setBalance(response)));
    }
  }, [plug, isConnected]);

  useEffect(() => {
    if (swapActor && principalId) {
      swapActor
        .getUserBalances(Principal.fromText(principalId))
        .then((response) => dispatch(swapActions.setBalances(response)));
    }
  }, [swapActor, principalId]);

  return {
    plugBalance,
    sonicBalance,
    totalBalance,
  };
};

// === UTILS ===

const sumBalances = (...balances: Balance[]): Balance => {
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
  }, {} as Balance);
};
