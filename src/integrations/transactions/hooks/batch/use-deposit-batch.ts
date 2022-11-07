import { useMemo } from 'react';

import {
  DepositModalDataStep,
  modalsSliceActions,
  useAppDispatch,
} from '@/store';

import { Deposit } from '../..';
import {
  useApproveTransactionMemo,
  useBatch,
  useDepositTransactionMemo,
} from '..';
import { getDepositTransactions } from '.';

export const useDepositBatch = (deposit: Deposit) => {
  const dispatch = useAppDispatch();

  const approveTx = useApproveTransactionMemo(deposit);
  const depositTx = useDepositTransactionMemo(deposit);

  const transactions = useMemo(
    () =>
      getDepositTransactions({
        approveTx,
        depositTx,
        txNames: ['approve', 'deposit'],
      }),
    [approveTx, depositTx]
  );

  const openBatchModal = () => {
    dispatch(
      modalsSliceActions.setDepositModalData({
        steps: Object.keys(transactions) as DepositModalDataStep[],
        tokenSymbol: deposit.token?.symbol,
      })
    );
    dispatch(modalsSliceActions.openDepositProgressModal());
  };
  return {
    batch: useBatch<DepositModalDataStep>({
      transactions,
      handleRetry: () => {
        dispatch(modalsSliceActions.closeDepositProgressModal());
        dispatch(modalsSliceActions.openDepositFailModal());

        return Promise.resolve(false);
      },
    }),
    openBatchModal,
  };
};
