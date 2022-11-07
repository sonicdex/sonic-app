import {
  modalsSliceActions,
  useAppDispatch,
  WithdrawModalDataStep,
} from '@/store';

import { Withdraw } from '../..';
import { useBatch, useWithdrawTransactionMemo } from '..';

export const useWithdrawBatch = (withdraw: Withdraw) => {
  const dispatch = useAppDispatch();

  const openBatchModal = () => {
    dispatch(
      modalsSliceActions.setWithdrawModalData({
        steps: ['withdraw'] as WithdrawModalDataStep[],
        tokenSymbol: withdraw.token?.symbol,
      })
    );
    dispatch(modalsSliceActions.openWithdrawProgressModal());
  };

  const withdrawMemo = useWithdrawTransactionMemo(withdraw);

  return {
    batch: useBatch({
      transactions: {
        withdraw: withdrawMemo,
      },
      handleRetry: () => {
        dispatch(modalsSliceActions.closeWithdrawProgressModal());
        dispatch(modalsSliceActions.openWithdrawFailModal());

        return Promise.resolve(false);
      },
    }),
    openBatchModal,
  };
};
