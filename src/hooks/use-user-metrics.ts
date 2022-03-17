import { useCallback, useEffect, useState } from 'react';

import { AnalyticsApi } from '@/apis';
import { useKeepSync, usePlugStore, useSwapCanisterStore } from '@/store';
import { getPairIdsFromPairList } from '@/utils/format';

export type UserPairMetrics = {
  [canisterId: string]: AnalyticsApi.PositionMetrics;
};

export const useUserMetrics = () => {
  const { principalId } = usePlugStore();
  const { allPairs } = useSwapCanisterStore();
  const [isLoading, setIsLoading] = useState(false);
  const [userPairMetrics, setUserPairMetrics] = useState<UserPairMetrics>();

  const getUserMetrics = useKeepSync(
    'getUserMetrics',
    useCallback(async () => {
      if (isLoading) {
        return;
      }

      if (!principalId || !allPairs) {
        setUserPairMetrics(undefined);
        return;
      }

      const pairIds = getPairIdsFromPairList(allPairs);

      setIsLoading(true);
      try {
        const analyticsApi = new AnalyticsApi();
        const promises = pairIds.map((pairId) =>
          analyticsApi.queryUserMetrics(principalId, pairId)
        );
        const responses = await Promise.all(promises);

        const _userPairMetrics = responses.reduce((acc, response, index) => {
          acc[pairIds[index]] = response;
          return acc;
        }, {} as UserPairMetrics);

        setUserPairMetrics(_userPairMetrics);
      } catch (error) {
        console.error(`User metrics fetch error`, error);
      }
      setIsLoading(false);
    }, [setUserPairMetrics, principalId, allPairs, isLoading])
  );

  useEffect(() => {
    if (!userPairMetrics) {
      getUserMetrics();
    }
  }, [principalId, getUserMetrics]);

  return {
    isLoading,
    userPairMetrics,
    getUserMetrics,
  };
};
