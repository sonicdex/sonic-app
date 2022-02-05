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
    (errorMessage?: string, callback?: (errorText: string) => unknown) => {
      if (!errorMessage) {
        return;
      }

      console.error('Minting Error', errorMessage);

      const isBlockUsedError = errorMessage.includes('BlockUsed');
      const isUnauthorizedError = errorMessage.includes('Unauthorized');
      const isOtherError = errorMessage.includes('Other');
      const isOperationStyleError = errorMessage.includes(
        'ErrorOperationStyle'
      );
      const isErrorToError = errorMessage.includes('ErrorTo');
      const isAmountToSmallError = errorMessage.includes('AmountToSmall');

      const errorText = isUnauthorizedError
        ? `Block Height entered does not match your address`
        : isOtherError
        ? `Wrap failed, check if the Block Height correct`
        : isBlockUsedError
        ? `Block Height entered is already used`
        : isOperationStyleError
        ? `Block Height is not related to mint transaction type`
        : isErrorToError
        ? `Selected token symbol does not match the Block Height`
        : isAmountToSmallError
        ? `Amount to mint is too small`
        : `Wrap failed, please try again later`;

      if (isBlockUsedError && principalId) {
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

      if (callback) {
        callback(errorText);
      }
    },
    [dispatch, notificationId, principalId]
  );

  return handleMintError;
};
