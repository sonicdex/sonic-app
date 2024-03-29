import { useEffect, useState } from 'react';

import { MINT_AUTO_NOTIFICATION_TITLES } from '@/notifications';
import {
  modalsSliceActions,
  NotificationState,
  NotificationType,
  useAppDispatch,
  useNotificationStore,
  useWalletStore,
} from '@/store';
import {
  getFromStorage,
  LocalStorageKey,
  MintUncompleteBlockHeights,
} from '@/utils';

export const useBlockHeightsInit = () => {
  const [notificationId] = useState(String(new Date().getTime()));
  const { isConnected, principalId } = useWalletStore();
  const { addNotification, popNotification } = useNotificationStore();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const totalBlockHeightsWICP = getFromStorage(
      LocalStorageKey.MintWICPUncompleteBlockHeights
    ) as MintUncompleteBlockHeights | undefined;
    const totalBlockHeightsXTC = getFromStorage(
      LocalStorageKey.MintXTCUncompleteBlockHeights
    ) as MintUncompleteBlockHeights | undefined;

    if (principalId) {
      const blockHeightsXTC = totalBlockHeightsXTC?.[principalId];
      const blockHeightsWICP = totalBlockHeightsWICP?.[principalId];

      if (blockHeightsWICP || blockHeightsXTC) {
        const totalLength =
          (blockHeightsWICP?.length ?? 0) + (blockHeightsXTC?.length ?? 0);

        if (blockHeightsWICP) {
          dispatch(
            modalsSliceActions.setMintWICPUncompleteBlockHeights(
              blockHeightsWICP
            )
          );
        }
        if (blockHeightsXTC) {
          dispatch(
            modalsSliceActions.setMintXTCUncompleteBlockHeights(blockHeightsXTC)
          );
        }

        if (totalLength >= 1 && isConnected) {
          addNotification({
            id: notificationId,
            title: MINT_AUTO_NOTIFICATION_TITLES[NotificationState.Error],
            type: NotificationType.MintAuto,
            state: NotificationState.Error,
          });
        }
      }
    }

    if (!isConnected || !principalId) {
      popNotification(notificationId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, principalId]);
};
