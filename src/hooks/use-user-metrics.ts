import { useCallback, useEffect, useState } from 'react';

import { AnalyticsApi } from '@/apis';
import { useKeepSync, usePlugStore, useSwapCanisterStore } from '@/store';
import { getPairIdsFromPairList } from '@/utils/format';

export type UserLPMetrics = {
  [pairId: string]: AnalyticsApi.PositionMetrics;
};

export const useUserMetrics = () => {
  const { principalId } = usePlugStore();
  const { allPairs } = useSwapCanisterStore();
  const [isLoading, setIsLoading] = useState(false);
  const [userLPMetrics, setUserLPMetrics] = useState<UserLPMetrics>();

  const getUserLPMetrics = useKeepSync(
    'getUserMetrics',
    useCallback(async () => {
      if (isLoading) {
        return;
      }

      if (!principalId || !allPairs) {
        setUserLPMetrics(undefined);
        return;
      }

      const pairIds = getPairIdsFromPairList(allPairs);

      setIsLoading(true);
      try {
        const analyticsApi = new AnalyticsApi();
        const promises = pairIds.map((pairId) =>
          analyticsApi.queryUserLPMetrics(principalId, pairId)
        );
        const responses = await Promise.all(promises);

        const _userPairMetrics = responses.reduce((acc, response, index) => {
          acc[pairIds[index]] = response;
          return acc;
        }, {} as UserLPMetrics);

        setUserLPMetrics(_userPairMetrics);
      } catch (error) {
        console.error(`User metrics fetch error`, error);
      }
      setIsLoading(false);
    }, [setUserLPMetrics, principalId, allPairs, isLoading])
  );

  useEffect(() => {
    if (!userLPMetrics) {
      getUserLPMetrics();
    }
  }, [principalId, getUserLPMetrics]);

  return {
    isLoading,
    userPairMetrics: userLPMetrics,
    getUserMetrics: getUserLPMetrics,
  };
};
