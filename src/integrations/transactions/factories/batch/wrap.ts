import { useMemo } from 'react';

import { ENV } from '@/config';
import {
  modalsSliceActions,
  useAppDispatch,
  useSwapViewStore,
  WrapModalDataStep,
} from '@/store';

import { useBatchHook } from '..';
import { Batch } from '../..';
import {
  useMintWICPTransactionMemo,
  useLedgerTransferTransactionMemo,
  useWithdrawTransactionMemo,
} from '../transactions';

export const WICP_ACCOUNT_ID =
  'cc659fe529756bae6f72db9937c6c60cf7ad57eb4ac5f930a75748927aab469a';

type Wrap = {
  keepInSonic?: boolean;
  amount: string;
};

export const useWrapBatch = ({ amount, keepInSonic = false }: Wrap) => {
  const { tokenList } = useSwapViewStore();
  const dispatch = useAppDispatch();

  const withdrawParams = {
    token: tokenList![ENV.canisterIds.WICP],
    amount: amount.toString(),
  };

  const ledgerTransfer = useLedgerTransferTransactionMemo({
    toAccountId: WICP_ACCOUNT_ID,
    amount,
  });
  const mintWICP = useMintWICPTransactionMemo({});
  const withdraw = useWithdrawTransactionMemo(withdrawParams);

  const transactions = useMemo(() => {
    let transactions: Partial<Record<WrapModalDataStep, any>> = {
      ledgerTransfer,
      mintWICP,
    };

    if (!keepInSonic) {
      transactions = {
        ...transactions,
        withdraw,
      };
    }

    return transactions;
  }, [ledgerTransfer, mintWICP, withdraw, keepInSonic]);

  const handleOpenBatchModal = () => {
    dispatch(
      modalsSliceActions.setWrapData({
        steps: Object.keys(transactions) as WrapModalDataStep[],
      })
    );
    dispatch(modalsSliceActions.openWrapProgressModal());
  };

  return [
    useBatchHook({
      transactions,
      handleRetry: () => {
        dispatch(modalsSliceActions.closeWrapProgressModal());
        return Promise.resolve(false);
      },
    }),
    handleOpenBatchModal,
  ] as [Batch.Hook<WrapModalDataStep>, () => void];
};
