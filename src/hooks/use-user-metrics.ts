import { useEffect, useState } from 'react';
import { Principal } from '@dfinity/principal';
import { AnalyticsApi } from '@/apis';
import {  useWalletStore, useSwapCanisterStore } from '@/store';
import { AppLog } from '@/utils';

import { getswapActor } from '@/utils'

export type UserLPMetrics = {
  [pairId: string]: AnalyticsApi.PositionMetrics;
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

      const swapActor = await getswapActor(true);
      const response = await swapActor.getUserLPBalancesAbove(Principal.fromText(principalId), BigInt(0));

      const pairIds:any[] =response.length >0? response.map(x=>x[0] ) :[];

      setIsLoading(true);

      const analyticsApi = new AnalyticsApi();
      const promises = pairIds.map((pairId) => analyticsApi.queryUserLPMetrics(principalId, pairId));
      const responses = await Promise.all(promises);

      const _userPairMetrics = responses.reduce((acc, response, index) => {
        acc[pairIds[index]] = response; return acc;
      }, {} as UserLPMetrics);
      setUserLPMetrics(_userPairMetrics);
    } catch (error) {
      AppLog.error(`User metrics fetch error`, error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getUserLPMetrics()
  }, [principalId]);

  return { isLoading, userPairMetrics: userLPMetrics, getUserMetrics: getUserLPMetrics};
};
