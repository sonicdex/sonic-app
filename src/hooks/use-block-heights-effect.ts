import { useEffect } from 'react';

import { getFromStorage, LocalStorageKey } from '@/config';
import {
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useNotificationStore,
} from '@/store';

export const BLOCK_HEIGHTS_TITLE =
  'You have unfinished or failed mint(s), click retry mint below.';

export const useBlockHeightsEffect = () => {
  const { addNotification } = useNotificationStore();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const blockHeightsWICP = getFromStorage(
      LocalStorageKey.MintWICPUncompleteBlockHeights
    );
    const blockHeightsXTC = getFromStorage(
      LocalStorageKey.MintXTCUncompleteBlockHeights
    );

    if (blockHeightsWICP || blockHeightsXTC) {
      const totalLength =
        (blockHeightsWICP?.length ?? 0) + (blockHeightsXTC?.length ?? 0);

      if (blockHeightsWICP) {
        dispatch(
          modalsSliceActions.setMintWICPUncompleteBlockHeights(blockHeightsWICP)
        );
      }
      if (blockHeightsXTC) {
        dispatch(
          modalsSliceActions.setMintXTCUncompleteBlockHeights(blockHeightsXTC)
        );
      }

      if (totalLength >= 1) {
        addNotification({
          id: String(new Date().getTime()),
          title: BLOCK_HEIGHTS_TITLE,
          type: NotificationType.MintAuto,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
