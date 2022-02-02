import { useMemo } from 'react';

import {
  ENV,
  getFromStorage,
  LocalStorageKey,
  MintUncompleteBlockHeights,
  saveToStorage,
} from '@/config';
import { BLOCK_HEIGHTS_TITLE } from '@/hooks/use-block-heights-effect';
import {
  MintXTCModalDataStep,
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useModalsStore,
  useNotificationStore,
  usePlugStore,
  useSwapViewStore,
} from '@/store';

import {
  useApproveTransactionMemo,
  useBatchHook,
  useDepositTransactionMemo,
  useLedgerTransferTransactionMemo,
} from '..';
import { getMintXTCTransaction } from '../transactions/mint-xtc';

export type UseMintXTCBatchOptions = {
  amountIn: string;
  amountOut: string;
  blockHeight?: string;
  keepInSonic?: boolean;
};

export const useMintXTCBatch = ({
  amountIn,
  amountOut,
  blockHeight,
  keepInSonic,
}: UseMintXTCBatchOptions) => {
  const { tokenList } = useSwapViewStore();
  const { principalId } = usePlugStore();
  const dispatch = useAppDispatch();
  const { addNotification } = useNotificationStore();
  const { mintXTCUncompleteBlockHeights } = useModalsStore();

  if (!tokenList) throw new Error('Token list is required');

  const depositParams = {
    token: tokenList[ENV.canistersPrincipalIDs.XTC],
    amount: amountOut,
  };

  const ledgerTransfer = useLedgerTransferTransactionMemo({
    toAccountId: ENV.accountIDs.XTC,
    amount: amountIn,
  });
  const mintXTC = getMintXTCTransaction({ blockHeight });
  const approve = useApproveTransactionMemo(depositParams);
  const deposit = useDepositTransactionMemo(depositParams);

  const transactions = useMemo(() => {
    let transactions: Partial<Record<MintXTCModalDataStep, any>> = {
      mintXTC,
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
  }, [ledgerTransfer, mintXTC, blockHeight, approve, deposit, keepInSonic]);

  const openBatchModal = () => {
    dispatch(
      modalsSliceActions.setMintXTCModalData({
        steps: Object.keys(transactions) as MintXTCModalDataStep[],
      })
    );
    dispatch(modalsSliceActions.openMintXTCProgressModal());
  };

  return {
    batch: useBatchHook<MintXTCModalDataStep>({
      transactions,
      handleRetry: async (error, prevResponses) => {
        const failedBlockHeight = prevResponses?.[0]?.response as
          | bigint
          | undefined;

        if (failedBlockHeight) {
          dispatch(
            modalsSliceActions.setMintXTCUncompleteBlockHeights([
              ...(mintXTCUncompleteBlockHeights
                ? mintXTCUncompleteBlockHeights
                : []),
              String(failedBlockHeight),
            ])
          );
        }

        return new Promise<boolean | { nextTxArgs: any }>((resolve) => {
          dispatch(
            modalsSliceActions.setMintXTCModalData({
              callbacks: [
                // Retry callback
                () => {
                  openBatchModal();
                  resolve({ nextTxArgs: prevResponses });
                },
                // Close callback
                () => {
                  const prevMintXTCBlockHeight = getFromStorage(
                    LocalStorageKey.MintXTCUncompleteBlockHeights
                  ) as MintUncompleteBlockHeights | undefined;

                  if (failedBlockHeight && principalId) {
                    const newBlockHeights = {
                      ...prevMintXTCBlockHeight,
                      [principalId]: [
                        ...(prevMintXTCBlockHeight?.[principalId] || []),
                        String(failedBlockHeight),
                      ],
                    };

                    saveToStorage(
                      LocalStorageKey.MintXTCUncompleteBlockHeights,
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

          dispatch(modalsSliceActions.closeMintXTCProgressModal());
          dispatch(modalsSliceActions.openMintXTCFailModal());
        });
      },
    }),
    openBatchModal,
  };
};
