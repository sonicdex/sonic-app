import { useEffect, useState } from 'react';

import { AnalyticsApi } from '@/apis';
import { useWalletStore, useSwapCanisterStore } from '@/store';
import { AppLog } from '@/utils';

// import { Principal } from '@dfinity/principal';
// import { getswapActor } from '@/utils'

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

// export const getuserLprewards = (token0: string, token1: string) => {
//   const { principalId } = useWalletStore();
//   const [data, setData] = useState({ token0: BigInt(0), token1: BigInt(0) });

//   const getUserRwds = async () => {
//     const swapActor = await getswapActor(true);
//     if (!principalId) { return; }
//     const response: any = await swapActor.getUserReward(Principal.fromText(principalId), token0, token1);
//     setData({ token0: response?.ok[0], token1: response?.ok[1] })
//     return data;
//   }
//   useEffect(() => { getUserRwds(); }, [principalId]);

//   return data

// }