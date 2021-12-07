import { useMemo } from 'react';

import { Balance } from '@/models';
import { usePlugStore, useSwapStore } from '@/store';

export const useBalances = () => {
  const { balance: plugBalance } = usePlugStore();
  const { balance: sonicBalance } = useSwapStore();

  const totalBalance = useMemo(() => {
    if (plugBalance && sonicBalance) {
      return sumBalances(plugBalance, sonicBalance);
    }

    return undefined;
  }, [plugBalance, sonicBalance]);

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
