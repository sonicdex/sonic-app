import { useCallback } from 'react';

import {
  getFromStorage,
  LocalStorageKey,
  MintUncompleteBlockHeights,
  saveToStorage,
} from '@/config';
import {
  MintTokenSymbol,
  modalsSliceActions,
  popNotification,
  useAppDispatch,
  usePlugStore,
} from '@/store';

export type UseMintErrorHandlerOptions = {
  notificationId: string;
  errorMessage?: string;
};

export const useMintErrorHandler = ({
  notificationId,
}: UseMintErrorHandlerOptions) => {
  const { principalId } = usePlugStore();
  const dispatch = useAppDispatch();

  const handleMintError = useCallback(
    (errorMessage?: string) => {
      if (!errorMessage) {
        return;
      }

      console.error('Minting Error', errorMessage);

      const isBlockUsed = errorMessage.includes('BlockUsed');
      const isUnauthorizedError = errorMessage.includes('Unauthorized');
      const isOtherError = errorMessage.includes('Other');
      const isErrorOperationStyle = errorMessage.includes(
        'ErrorOperationStyle'
      );

      const errorText = isUnauthorizedError
        ? `Block Height entered does not match your address`
        : isOtherError
        ? `Wrap failed, check if the Block Height is correct or try again later`
        : isBlockUsed
        ? `Block Height entered is already used`
        : isErrorOperationStyle
        ? `Block Height is not related to mint transaction type`
        : `Wrap failed, please try again later`;

      if (isBlockUsed && principalId) {
        const removeLastProcessedTransaction = (
          tokenSymbol: MintTokenSymbol
        ) => {
          const localStorageKey =
            tokenSymbol === MintTokenSymbol.WICP
              ? LocalStorageKey.MintWICPUncompleteBlockHeights
              : LocalStorageKey.MintXTCUncompleteBlockHeights;

          const prevMintBlockHeightData = getFromStorage(localStorageKey) as
            | MintUncompleteBlockHeights
            | undefined;

          const newBlockHeightData = {
            ...prevMintBlockHeightData,
            [principalId]: [
              ...(prevMintBlockHeightData?.[principalId]?.filter(
                (_, index) => index !== 0
              ) || []),
            ],
          };

          saveToStorage(localStorageKey, newBlockHeightData);
        };

        removeLastProcessedTransaction(MintTokenSymbol.WICP);
        removeLastProcessedTransaction(MintTokenSymbol.XTC);

        dispatch(popNotification(notificationId));
      }

      dispatch(modalsSliceActions.setMintManualModalErrorMessage(errorText));
      dispatch(modalsSliceActions.openMintManualModal());
    },
    [dispatch, notificationId, principalId]
  );

  return handleMintError;
};
