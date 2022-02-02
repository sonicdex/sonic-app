import { useMemo } from 'react';

import { ENV, getFromStorage, LocalStorageKey, saveToStorage } from '@/config';
import {
  MintXTCModalDataStep,
  modalsSliceActions,
  useAppDispatch,
  useModalsStore,
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
  const dispatch = useAppDispatch();
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

        console.log(prevResponses);

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

        return new Promise<boolean>((resolve) => {
          dispatch(
            modalsSliceActions.setMintXTCModalData({
              callbacks: [
                // Retry callback
                () => {
                  openBatchModal();
                  resolve(true);
                },
                // Close callback
                () => {
                  const prevMintXTCBlockHeight = getFromStorage(
                    LocalStorageKey.MintXTCUncompleteBlockHeights
                  );

                  if (failedBlockHeight) {
                    saveToStorage(
                      LocalStorageKey.MintXTCUncompleteBlockHeights,
                      [
                        ...(typeof prevMintXTCBlockHeight !== 'undefined'
                          ? prevMintXTCBlockHeight
                          : []),
                        String(failedBlockHeight),
                      ]
                    );
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
