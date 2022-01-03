import { useMemo } from 'react';

import {
  modalsSliceActions,
  RemoveLiquidityModalDataStep,
  useAppDispatch,
  useSwapCanisterStore,
} from '@/store';

import { Batch, RemoveLiquidity } from '../..';
import {
  useBatchHook,
  useRemoveLiquidityTransactionMemo,
  useWithdrawTransactionMemo,
} from '..';

export interface UseRemoveLiquidityBatchOptions extends RemoveLiquidity {
  keepInSonic: boolean;
}

export const useRemoveLiquidityBatch = ({
  keepInSonic,
  ...removeLiquidityParams
}: UseRemoveLiquidityBatchOptions) => {
  const dispatch = useAppDispatch();
  const { sonicBalances } = useSwapCanisterStore();

  if (!sonicBalances) {
    throw new Error('Sonic balance are required');
  }

  if (
    !removeLiquidityParams.token0.metadata ||
    !removeLiquidityParams.token1.metadata
  ) {
    throw new Error('Tokens are required');
  }

  const withdraw0Params = {
    token: removeLiquidityParams.token0.metadata,
    amount: removeLiquidityParams.amount0Min.toString(),
  };

  const withdraw1Params = {
    token: removeLiquidityParams.token1.metadata,
    amount: removeLiquidityParams.amount1Min.toString(),
  };

  const removeLiquidity = useRemoveLiquidityTransactionMemo(
    removeLiquidityParams
  );
  const withdraw0 = useWithdrawTransactionMemo(withdraw0Params);
  const withdraw1 = useWithdrawTransactionMemo(withdraw1Params);

  const transactions = useMemo(() => {
    let _transactions: any = {
      removeLiquidity,
    };

    if (!keepInSonic) {
      _transactions = {
        ..._transactions,
        withdraw0,
        withdraw1,
      };
    }

    return _transactions;
  }, [...Object.values(removeLiquidityParams), keepInSonic]);

  const handleRetry = async () => {
    return new Promise<boolean>((resolve) => {
      dispatch(
        modalsSliceActions.setRemoveLiquidityModalData({
          callbacks: [
            // Retry callback
            () => {
              openRemoveLiquidityModal();
              resolve(true);
            },
            // Not retry callback
            () => {
              resolve(false);
            },
          ],
        })
      );

      dispatch(modalsSliceActions.closeRemoveLiquidityProgressModal());
      dispatch(modalsSliceActions.openRemoveLiquidityFailModal());
    });
  };

  const openRemoveLiquidityModal = () => {
    dispatch(
      modalsSliceActions.setRemoveLiquidityModalData({
        steps: Object.keys(transactions) as RemoveLiquidityModalDataStep[],
        token0Symbol: removeLiquidityParams.token0.metadata?.symbol,
        token1Symbol: removeLiquidityParams.token1.metadata?.symbol,
      })
    );

    dispatch(modalsSliceActions.openRemoveLiquidityProgressModal());
  };

  return [
    useBatchHook<RemoveLiquidityModalDataStep>({ transactions, handleRetry }),
    openRemoveLiquidityModal,
  ] as [Batch.Hook<RemoveLiquidityModalDataStep>, () => void];
};
