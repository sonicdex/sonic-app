import {
  modalsSliceActions,
  useAppDispatch,
  WithdrawModalDataStep,
} from '@/store';

import { Withdraw } from '../..';
import { useBatchHook, useWithdrawTransactionMemo } from '..';

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

  return {
    batch: useBatchHook({
      transactions: {
        withdraw: useWithdrawTransactionMemo(withdraw),
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
