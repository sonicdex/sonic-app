import { useCallback, useEffect, useState } from 'react';

import { AnalyticsApi } from '@/apis';
import { useKeepSync, usePlugStore, useSwapCanisterStore } from '@/store';
import { getPairIdsFromPairList } from '@/utils/format';

export type UserPairMetrics = {
  [canisterId: string]: AnalyticsApi.ReturnMetrics;
};

export const useUserMetrics = () => {
  const { principalId } = usePlugStore();
  const { allPairs } = useSwapCanisterStore();
  const [isLoading, setIsLoading] = useState(false);
  const [userMetrics, setUserMetrics] = useState<UserPairMetrics>();

  const getUserMetrics = useKeepSync(
    'getUserMetrics',
    useCallback(async () => {
      if (!principalId || !allPairs) {
        setUserMetrics(undefined);
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

        const userPairMetrics = responses.reduce((acc, response, index) => {
          acc[pairIds[index]] = response;
          return acc;
        }, {} as UserPairMetrics);

        setUserMetrics(userPairMetrics);
      } catch (error) {
        console.error(`User metrics fetch error`, error);
      }
      setIsLoading(false);
    }, [setIsLoading, setUserMetrics, principalId, allPairs])
  );

  useEffect(() => {
    if (!userMetrics) {
      getUserMetrics();
    }
  }, [principalId, getUserMetrics]);

  return {
    isLoading,
    userMetrics,
    getUserMetrics,
  };
};
