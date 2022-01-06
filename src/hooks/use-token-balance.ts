import { useMemo } from 'react';

import { ICP_TOKEN_METADATA } from '@/constants';

import { useBalances } from './use-balances';

export const useTokenBalanceMemo = (canisterId?: string) => {
  const { totalBalances, icpBalance } = useBalances();

  return useMemo(() => {
    if (canisterId && totalBalances) {
      const isICP = canisterId === ICP_TOKEN_METADATA.id;

      if (isICP) {
        return icpBalance;
      }

      return totalBalances[canisterId];
    }
  }, [canisterId, totalBalances, icpBalance]);
};
