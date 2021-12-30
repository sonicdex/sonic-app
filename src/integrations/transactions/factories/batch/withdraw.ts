import {
  modalsSliceActions,
  useAppDispatch,
  WithdrawModalDataStep,
} from '@/store';
import { useWithdrawTransactionMemo, useBatchHook } from '..';
import { Batch, Withdraw } from '../..';

export const useWithdrawBatch = (withdraw: Withdraw) => {
  const dispatch = useAppDispatch();

  const handleOpenWithdrawModal = () => {
    dispatch(
      modalsSliceActions.setWithdrawData({
        steps: ['withdraw'] as WithdrawModalDataStep[],
        tokenSymbol: withdraw.token?.symbol,
      })
    );
    dispatch(modalsSliceActions.openWithdrawProgressModal());
  };

  return [
    useBatchHook({
      transactions: {
        withdraw: useWithdrawTransactionMemo(withdraw),
      },
      handleRetry: () => {
        dispatch(modalsSliceActions.closeWithdrawProgressModal());
        return Promise.resolve(false);
      },
    }),
    handleOpenWithdrawModal,
  ] as [Batch.Hook<WithdrawModalDataStep>, () => void];
};
