import { useEffect, useState } from 'react';
import { Principal } from '@dfinity/principal';
import { AnalyticsApi } from '@/apis';
import { useWalletStore, useSwapCanisterStore } from '@/store';
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

      const pairIds: any[] = response.length > 0 ? response.map(x => x[0]) : [];

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

  return { isLoading, userPairMetrics: userLPMetrics, getUserMetrics: getUserLPMetrics };
};

export const getuserLprewards = (token0: string, token1: string) => {
  const { principalId } = useWalletStore();
  const [data, setData] = useState({ token0: BigInt(0), token1: BigInt(0) });

  const getUserRwds = async () => {
    const swapActor = await getswapActor(true);
    if (!principalId) { return; }
    const response: any = await swapActor.getUserReward(Principal.fromText(principalId), token0, token1);
    setData({ token0: response?.ok[0], token1: response?.ok[1] })
    return data;
  }
  useEffect(() => { getUserRwds(); }, [principalId]);

  return data

}