import { useCallback, useMemo, useState } from 'react';

import { ENV, getFromStorage, LocalStorageKey, saveToStorage } from '@/config';
import {
  modalsSliceActions,
  useAppDispatch,
  useModalsStore,
  useSwapViewStore,
  WrapModalData,
  WrapModalDataStep,
} from '@/store';

import { useBatchHook } from '..';
import {
  useApproveTransactionMemo,
  useDepositTransactionMemo,
  useLedgerTransferTransactionMemo,
  useMintWICPTransactionMemo,
} from '../transactions';

type UseMintWICPBatchOptions = {
  keepInSonic?: boolean;
  amount: string;
};

export const useMintWICPBatch = ({
  amount,
  keepInSonic = false,
}: UseMintWICPBatchOptions) => {
  const [numberOfRetries, setNumberOfRetries] = useState(0);

  const { tokenList } = useSwapViewStore();
  const {
    wrapModalData: { callbacks: [retryCallback] = [] },
    mintWICPUncompleteBlockHeights: wrapUncompleteBlockHeights,
  } = useModalsStore();
  const dispatch = useAppDispatch();

  if (!tokenList) throw new Error('Token list is required');

  const depositParams = {
    token: tokenList[ENV.canistersPrincipalIDs.WICP],
    amount: amount.toString(),
  };

  const ledgerTransfer = useLedgerTransferTransactionMemo({
    toAccountId: ENV.accountIDs.WICP,
    amount,
  });
  const mintWICP = useMintWICPTransactionMemo({});
  const approve = useApproveTransactionMemo(depositParams);
  const deposit = useDepositTransactionMemo(depositParams);

  const transactions = useMemo(() => {
    let transactions: Partial<Record<WrapModalDataStep, any>> = {
      ledgerTransfer,
      mintWICP,
    };

    if (keepInSonic) {
      transactions = {
        ...transactions,
        approve,
        deposit,
      };
    }

    return transactions;
  }, [ledgerTransfer, mintWICP, approve, deposit, keepInSonic]);

  const openBatchModal = useCallback(() => {
    const steps = Object.keys(transactions) as WrapModalData['steps'];

    dispatch(modalsSliceActions.setWrapModalData({ steps }));
    dispatch(modalsSliceActions.openWrapProgressModal());
  }, [dispatch, transactions]);

  const batch = useBatchHook<WrapModalDataStep>({
    transactions,
    handleRetry: async (error, prevResponses) => {
      const failedBlockHeight = prevResponses?.[0]?.response as
        | bigint
        | undefined;

      if (failedBlockHeight) {
        dispatch(
          modalsSliceActions.setMintWICPUncompleteBlockHeights([
            ...(wrapUncompleteBlockHeights ? wrapUncompleteBlockHeights : []),
            String(failedBlockHeight),
          ])
        );
      }

      return new Promise<boolean>((resolve) => {
        dispatch(
          modalsSliceActions.setWrapModalData({
            callbacks: [
              // Retry callback
              () => {
                openBatchModal();
                resolve(true);
              },
              // Close callback
              () => {
                const prevMintWICPBlockHeight = getFromStorage(
                  LocalStorageKey.MintWICPUncompleteBlockHeights
                );

                saveToStorage(LocalStorageKey.MintWICPUncompleteBlockHeights, [
                  ...prevMintWICPBlockHeight,
                  failedBlockHeight,
                ]);
                resolve(false);
              },
            ],
          })
        );

        if (numberOfRetries === 0 && retryCallback) {
          retryCallback();
        }

        if (numberOfRetries >= 1 || !retryCallback) {
          dispatch(modalsSliceActions.closeWrapProgressModal());
          dispatch(modalsSliceActions.openWrapFailModal());
        }

        setNumberOfRetries(numberOfRetries + 1);
      });
    },
  });

  return { batch, openBatchModal };
};
