import { useEffect, useState } from 'react';

import { AnalyticsApi } from '@/apis';
import { useWalletStore, useSwapCanisterStore } from '@/store';
import { AppLog } from '@/utils';

export type UserLPMetrics = {
  [pairId: string]: AnalyticsApi.userLidityFeeMetrics;
};


export const useUserMetrics = () => {
  const { principalId } = useWalletStore();

  const { allPairs } = useSwapCanisterStore();
  const [isLoading, setIsLoading] = useState(false);
  const [userLPMetrics, setUserLPMetrics] = useState<UserLPMetrics>();

  const getUserLPMetrics = async () => {
    try {
      if (isLoading) { return; }
      if (!principalId || !allPairs) { setUserLPMetrics(undefined); return; }

      setIsLoading(true);
      
      const analyticsApi = new AnalyticsApi();
      const responses: any = await analyticsApi.queryUserLPMetrics2(principalId);
      const _userPairMetrics: UserLPMetrics = {};

      responses.forEach((el: any) => {
        var tokens: any = el.poolId?.split(':');
        _userPairMetrics[el.poolId] = el;
        _userPairMetrics[el.poolId].token0 = tokens[0];
        _userPairMetrics[el.poolId].token1 = tokens[1];
      });
    
      setUserLPMetrics(_userPairMetrics);
    } catch (error) {
      AppLog.error(`User metrics fetch error`, error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getUserLPMetrics()
  }, [principalId]);

  return { isLoading, userPairMetrics: userLPMetrics, getUserMetrics: getUserLPMetrics };
};
