import {
  modalsSliceActions,
  useAppDispatch,
  WithdrawModalDataStep,
} from '@/store';
import { useMemorizedWithdrawTransaction, useBatchHook } from '..';
import { Batch, Withdraw } from '../..';

export const useWithdrawBatch = (withdraw: Withdraw) => {
  const dispatch = useAppDispatch();

  const handleOpenWithdrawModal = () => {
    dispatch(
      modalsSliceActions.setWithdrawData({
        tokenSymbol: withdraw.token?.symbol,
      })
    );
    dispatch(modalsSliceActions.openWithdrawProgressModal());
  };

  return [
    useBatchHook({
      transactions: {
        withdraw: useMemorizedWithdrawTransaction(withdraw),
      },
      handleRetry: () => {
        dispatch(modalsSliceActions.closeWithdrawProgressModal());
        return Promise.resolve(false);
      },
    }),
    handleOpenWithdrawModal,
  ] as [Batch.Hook<WithdrawModalDataStep>, () => void];
};
