import { useEffect } from 'react';

import { getFromStorage, LocalStorageKey } from '@/config';
import {
  modalsSliceActions,
  NotificationType,
  useNotificationStore,
} from '@/store';

const SINGULAR_BLOCK_HEIGHTS_LENGTH_TITLE =
  'You have unfinished or failed mint, click retry mint below.';
const PLURAL_BLOCK_HEIGHTS_LENGTH_TITLE =
  'You have unfinished or failed mints, click retry mint below.';

export const useBlockHeightsEffect = () => {
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    const blockHeightsWICP = getFromStorage(
      LocalStorageKey.MintWICPUncompleteBlockHeights
    );
    const blockHeightsXTC = getFromStorage(
      LocalStorageKey.MintXTCUncompleteBlockHeights
    );

    if (blockHeightsWICP || blockHeightsXTC) {
      const totalLength = blockHeightsWICP.length + blockHeightsXTC.length;

      if (totalLength > 1) {
        addNotification({
          id: String(new Date().getTime()),
          title:
            totalLength % 2 === 0
              ? PLURAL_BLOCK_HEIGHTS_LENGTH_TITLE
              : SINGULAR_BLOCK_HEIGHTS_LENGTH_TITLE,
          type: NotificationType.FinishMint,
        });
      }

      if (blockHeightsWICP) {
        modalsSliceActions.setMintWICPUncompleteBlockHeights(blockHeightsWICP);
      }

      if (blockHeightsXTC) {
        modalsSliceActions.setMintXTCUncompleteBlockHeights(blockHeightsXTC);
      }
    }
  });
};
