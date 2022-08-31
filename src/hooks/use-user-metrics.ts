import { useCallback, useEffect, useState } from 'react';

import { AnalyticsApi } from '@/apis';
import {
  KEEP_SYNC_DEFAULT_INTERVAL,
  useKeepSync,
  usePlugStore,
  useSwapCanisterStore,
} from '@/store';
import { AppLog } from '@/utils';
import { getPairIdsFromPairList } from '@/utils/format';
import { debounce } from '@/utils/function';

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
      try {
        if (isLoading) {
          return;
        }

        if (!principalId || !allPairs) {
          setUserLPMetrics(undefined);
          return;
        }

        const pairIds = getPairIdsFromPairList(allPairs);

        setIsLoading(true);
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
        AppLog.error(`User metrics fetch error`, error);
        await new Promise((resolve) =>
          debounce(resolve, KEEP_SYNC_DEFAULT_INTERVAL)
        );
      }
      setIsLoading(false);
    }, [setUserLPMetrics, principalId, allPairs, isLoading])
  );

  useEffect(() => {
    if (!userLPMetrics) {
      getUserLPMetrics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [principalId]);

  return {
    isLoading,
    userPairMetrics: userLPMetrics,
    getUserMetrics: getUserLPMetrics,
  };
};
