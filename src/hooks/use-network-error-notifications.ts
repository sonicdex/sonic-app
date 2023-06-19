import { useEffect } from 'react';

import {
  FeatureState,
  NotificationType,
  useAppSelector,
  useNotificationStore,
} from '@/store';

const useNotificationEffect = (
  id: string,
  title: string,
  state: FeatureState,
  notifications: ReturnType<typeof useNotificationStore>
) =>
  useEffect(() => {
    if (state === FeatureState.Error) {
      return notifications.addNotification({
        id,
        title,
        errorMessage: 'Trying again in 15 seconds...',
        type: NotificationType.Error,
        timeout: '11s',
      });
    } else {
      notifications.popNotification(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

export const useNetworkErrorNotifications = () => {
  const { allPairsState, supportedTokenListState,  balanceState } =
    useAppSelector((state) => ({
      allPairsState: state.swap.allPairsState,
      supportedTokenListState: state.swap.supportedTokenListState,
      priceState: state.price.state,
      balanceState: state.swap.balancesState,
    }));
  const notifications = useNotificationStore();
 
  // useNotificationEffect(
  //   'icp-price-error',
  //   'Failed to fetch ICP price',
  //   priceState,
  //   notifications
  // );

  useNotificationEffect(
    'supported-token-list-error',
    'Failed to fetch supported token list',
    supportedTokenListState,
    notifications
  );

  useNotificationEffect(
    'all-pairs-error',
    'Failed to fetch all pairs',
    allPairsState,
    notifications
  );

  useNotificationEffect(
    'balance-error',
    'Failed to fetch balances',
    balanceState,
    notifications
  );
};
