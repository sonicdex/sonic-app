import {
  modalsSliceActions,
  useAppDispatch,
  WithdrawModalDataStep,
} from '@/store';

import { Withdraw } from '../..';
import { useBatchHook, useWithdrawTransactionMemo } from '..';

export const useWithdrawBatch = (withdraw: Withdraw) => {
  const dispatch = useAppDispatch();

  console.log(withdraw);

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
    batch: useBatchHook({
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
