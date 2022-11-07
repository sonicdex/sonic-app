import { useMemo } from 'react';

import { ICP_METADATA } from '@/constants';

import { useBalances } from './use-balances';

export const useTokenBalanceMemo = (canisterId?: string) => {
  const { totalBalances, icpBalance } = useBalances();

  return useMemo(() => {
    if (canisterId && totalBalances) {
      const isICP = canisterId === ICP_METADATA.id;

      if (isICP) {
        return icpBalance;
      }

      return totalBalances[canisterId];
    }
  }, [canisterId, totalBalances, icpBalance]);
};
