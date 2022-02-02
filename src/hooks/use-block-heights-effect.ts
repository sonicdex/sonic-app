import { useEffect, useState } from 'react';

import {
  getFromStorage,
  LocalStorageKey,
  MintUncompleteBlockHeights,
} from '@/config';
import {
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useNotificationStore,
  usePlugStore,
} from '@/store';

export const BLOCK_HEIGHTS_TITLE =
  'You have unfinished or failed mint(s), click retry mint below.';

export const useBlockHeightsEffect = () => {
  const [notificationId] = useState(String(new Date().getTime()));
  const { isConnected, principalId } = usePlugStore();
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
            title: BLOCK_HEIGHTS_TITLE,
            type: NotificationType.MintAuto,
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
