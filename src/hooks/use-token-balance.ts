import { useMemo } from 'react';
import { useBalances } from './use-balances';

export const useTokenBalance = (canisterId?: string) => {
  const { totalBalances, icpBalance } = useBalances();

  return useMemo(() => {
    if (canisterId && totalBalances) {
      const isICP = canisterId === 'ICP';
      console.log(canisterId, isICP, icpBalance);

      if (isICP) {
        return icpBalance;
      }

      return totalBalances[canisterId];
    }
  }, [canisterId, totalBalances, icpBalance]);
};
