import {
  modalsSliceActions,
  UnwrapModalDataStep,
  useAppDispatch,
} from '@/store';

import { useBatchHook } from '..';
import { Batch } from '../..';
import { useWithdrawWICPTransactionMemo } from '../transactions';

type Unwrap = {
  amount: bigint;
  toAccountId: string;
};

export const useUnwrapBatch = ({ amount, toAccountId }: Unwrap) => {
  const dispatch = useAppDispatch();

  const withdrawWICP = useWithdrawWICPTransactionMemo({
    amount,
    toAccountId,
  });

  const handleOpenBatchModal = () => {
    dispatch(
      modalsSliceActions.setUnwrapData({
        steps: ['withdrawWICP'],
      })
    );

    dispatch(modalsSliceActions.openUnwrapFailModal());
  };

  return [
    useBatchHook({
      transactions: {
        withdrawWICP,
      },
      handleRetry: () => {
        dispatch(modalsSliceActions.closeUnwrapProgressModal());
        return Promise.resolve(false);
      },
    }),
    handleOpenBatchModal,
  ] as [Batch.Hook<UnwrapModalDataStep>, () => void];
};
