import { useMemo } from 'react';

import { ENV } from '@/config';
import {
  MintXTCModalDataStep,
  modalsSliceActions,
  useAppDispatch,
  useSwapViewStore,
} from '@/store';

import {
  useApproveTransactionMemo,
  useBatchHook,
  useDepositTransactionMemo,
  useLedgerTransferTransactionMemo,
} from '..';
import { useMintXTCTransactionMemo } from '../transactions/mint-xtc';

export type UseMintXTCBatchOptions = {
  keepInSonic?: boolean;
  amount: string;
};

export const useMintXTCBatch = ({
  amount,
  keepInSonic,
}: UseMintXTCBatchOptions) => {
  const { tokenList } = useSwapViewStore();
  const dispatch = useAppDispatch();

  if (!tokenList) throw new Error('Token list is required');

  const depositParams = {
    token: tokenList[ENV.canistersPrincipalIDs.XTC],
    amount: amount.toString(),
  };

  const ledgerTransfer = useLedgerTransferTransactionMemo({
    toAccountId: ENV.accountIDs.XTC,
    amount,
  });
  const mintXTC = useMintXTCTransactionMemo({});
  const approve = useApproveTransactionMemo(depositParams);
  const deposit = useDepositTransactionMemo(depositParams);

  const transactions = useMemo(() => {
    let transactions: Partial<Record<MintXTCModalDataStep, any>> = {
      ledgerTransfer,
      mintXTC,
    };

    if (keepInSonic) {
      transactions = {
        ...transactions,
        approve,
        deposit,
      };
    }

    return transactions;
  }, [ledgerTransfer, mintXTC, approve, deposit, keepInSonic]);

  const openBatchModal = () => {
    dispatch(
      modalsSliceActions.setMintXTCModalData({
        steps: Object.keys(transactions) as MintXTCModalDataStep[],
      })
    );
    dispatch(modalsSliceActions.openMintXTCProgressModal());
  };

  return {
    batch: useBatchHook({
      transactions,
      handleRetry: () => {
        dispatch(modalsSliceActions.closeMintXTCProgressModal());
        dispatch(modalsSliceActions.openMintXTCFailModal());

        return Promise.resolve(false);
      },
    }),
    openBatchModal,
  };
};
