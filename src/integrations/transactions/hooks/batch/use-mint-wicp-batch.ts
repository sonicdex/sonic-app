import { useCallback, useMemo, useState } from 'react';

import { ENV, getFromStorage, LocalStorageKey, saveToStorage } from '@/config';
import { BLOCK_HEIGHTS_TITLE } from '@/hooks/use-block-heights-effect';
import {
  MintWICPModalData,
  MintWICPModalDataStep,
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useModalsStore,
  useNotificationStore,
  usePlugStore,
  useSwapViewStore,
} from '@/store';

import { useBatchHook } from '..';
import {
  getMintWICPTransaction,
  useApproveTransactionMemo,
  useDepositTransactionMemo,
  useLedgerTransferTransactionMemo,
} from '../transactions';

type UseMintWICPBatchOptions = {
  amount?: string;
  blockHeight?: string;
  keepInSonic?: boolean;
};

export const useMintWICPBatch = ({
  amount,
  blockHeight,
  keepInSonic = false,
}: UseMintWICPBatchOptions) => {
  const [numberOfRetries, setNumberOfRetries] = useState(0);

  const { tokenList } = useSwapViewStore();
  const {
    mintWICPModalData: { callbacks: [retryCallback] = [] },
    mintWICPUncompleteBlockHeights,
  } = useModalsStore();
  const dispatch = useAppDispatch();
  const { principalId } = usePlugStore();
  const { addNotification } = useNotificationStore();

  const depositParams = {
    token: tokenList?.[ENV.canistersPrincipalIDs.WICP],
    amount: amount?.toString(),
  };

  const ledgerTransfer = useLedgerTransferTransactionMemo({
    toAccountId: ENV.accountIDs.WICP,
    amount,
  });
  const mintWICP = getMintWICPTransaction({ blockHeight });
  const approve = useApproveTransactionMemo(depositParams);
  const deposit = useDepositTransactionMemo(depositParams);

  const transactions = useMemo(() => {
    let transactions: Partial<Record<MintWICPModalDataStep, any>> = {
      mintWICP,
    };

    if (!blockHeight) {
      transactions = {
        ledgerTransfer,
        ...transactions,
      };
    }

    if (keepInSonic) {
      transactions = {
        ...transactions,
        approve,
        deposit,
      };
    }

    return transactions;
  }, [ledgerTransfer, mintWICP, approve, deposit, blockHeight, keepInSonic]);

  const openBatchModal = useCallback(() => {
    const steps = Object.keys(transactions) as MintWICPModalData['steps'];

    dispatch(modalsSliceActions.setMintWICPModalData({ steps }));
    dispatch(modalsSliceActions.openMintWICPProgressModal());
  }, [dispatch, transactions]);

  const batch = useBatchHook<MintWICPModalDataStep>({
    transactions,
    handleRetry: async (error, prevResponses) => {
      const failedBlockHeight = prevResponses?.[0]?.response as
        | bigint
        | undefined;

      if (failedBlockHeight) {
        dispatch(
          modalsSliceActions.setMintWICPUncompleteBlockHeights([
            ...(mintWICPUncompleteBlockHeights
              ? mintWICPUncompleteBlockHeights
              : []),
            String(failedBlockHeight),
          ])
        );
      }

      return new Promise<boolean | { nextTxArgs: any }>((resolve) => {
        dispatch(
          modalsSliceActions.setMintWICPModalData({
            callbacks: [
              // Retry callback
              () => {
                openBatchModal();
                resolve({ nextTxArgs: prevResponses });
              },
              // Close callback
              () => {
                if (failedBlockHeight && principalId) {
                  const prevMintWICPBlockHeight = getFromStorage(
                    LocalStorageKey.MintWICPUncompleteBlockHeights
                  );

                  const newBlockHeights = {
                    ...prevMintWICPBlockHeight,
                    [principalId]: [
                      ...(prevMintWICPBlockHeight?.[principalId] || []),
                      String(failedBlockHeight),
                    ],
                  };

                  saveToStorage(
                    LocalStorageKey.MintWICPUncompleteBlockHeights,
                    newBlockHeights
                  );
                  addNotification({
                    id: String(new Date().getTime()),
                    title: BLOCK_HEIGHTS_TITLE,
                    type: NotificationType.MintAuto,
                  });
                }

                resolve(false);
              },
            ],
          })
        );

        if (numberOfRetries === 0 && retryCallback) {
          retryCallback();
        }

        if (numberOfRetries >= 1 || !retryCallback) {
          dispatch(modalsSliceActions.closeMintWICPProgressModal());
          dispatch(modalsSliceActions.openMintWICPFailModal());
        }

        setNumberOfRetries(numberOfRetries + 1);
      });
    },
  });

  return { batch, openBatchModal };
};
