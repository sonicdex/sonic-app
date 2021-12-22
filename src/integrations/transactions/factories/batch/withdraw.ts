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
    }),
    handleOpenWithdrawModal,
  ] as [Batch.Hook<WithdrawModalDataStep>, () => void];
};
