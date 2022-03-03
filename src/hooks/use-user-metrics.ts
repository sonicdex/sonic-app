import { AnalyticsApi } from '@/apis';
import { useKeepSync, usePlugStore } from '@/store';
import { useCallback, useEffect, useState } from 'react';

export const useUserMetrics = () => {
  const { principalId } = usePlugStore();
  const [isLoading, setIsLoading] = useState(false);
  const [userMetrics, setUserMetrics] = useState<AnalyticsApi.ReturnMetrics>();

  const getUserMetrics = useKeepSync(
    'getUserMetrics',
    useCallback(async () => {
      if (!principalId) {
        setUserMetrics(undefined);
        return;
      }

      setIsLoading(true);
      try {
        const analyticsApi = new AnalyticsApi();
        const response = await analyticsApi.queryUserMetrics(principalId);
        setUserMetrics(response);
      } catch (error) {
        console.error(`User metrics fetch error`, error);
      }
      setIsLoading(false);
    }, [setIsLoading, setUserMetrics, principalId])
  );

  useEffect(() => {
    getUserMetrics();
  }, [principalId]);

  return {
    isLoading,
    userMetrics,
    getUserMetrics,
  };
};
