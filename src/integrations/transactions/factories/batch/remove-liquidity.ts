import {
  modalsSliceActions,
  RemoveLiquidityModalDataStep,
  useAppDispatch,
  useSwapCanisterStore,
} from '@/store';
import { useMemo } from 'react';

import {
  useBatchHook,
  useMemorizedWithdrawTransaction,
  useMemorizedRemoveLiquidityTransaction,
} from '..';
import { Batch, RemoveLiquidity } from '../..';

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

  const withdrawParams = {
    token: removeLiquidityParams.token1.metadata,
    amount: removeLiquidityParams.token1.value,
  };

  const removeLiquidity = useMemorizedRemoveLiquidityTransaction(
    removeLiquidityParams
  );
  const withdraw = useMemorizedWithdrawTransaction(withdrawParams);

  const transactions = useMemo(() => {
    let _transactions: any = {
      removeLiquidity,
    };

    if (!keepInSonic) {
      _transactions = {
        ..._transactions,
        withdraw,
      };
    }

    return _transactions;
  }, [...Object.values(removeLiquidityParams), keepInSonic]);

  const handleRetry = async () => {
    return new Promise<boolean>((resolve) => {
      dispatch(
        modalsSliceActions.setRemoveLiquidityData({
          callbacks: [
            // Retry callback
            () => {
              openRemoveLiqudityModal();
              resolve(true);
            },
            // Not retry callback
            () => {
              modalsSliceActions.closeRemoveLiquidityModal();
              resolve(false);
            },
          ],
        })
      );

      resolve(false);
      dispatch(modalsSliceActions.closeRemoveLiquidityProgressModal());
      dispatch(modalsSliceActions.openRemoveLiquidityFailModal());
    });
  };

  const openRemoveLiqudityModal = () => {
    dispatch(
      modalsSliceActions.setRemoveLiquidityData({
        steps: Object.keys(transactions) as RemoveLiquidityModalDataStep[],
        token0Symbol: removeLiquidityParams.token0.metadata?.symbol,
        token1Symbol: removeLiquidityParams.token1.metadata?.symbol,
      })
    );

    dispatch(modalsSliceActions.openRemoveLiquidityProgressModal());
  };

  return [
    useBatchHook<RemoveLiquidityModalDataStep>({ transactions, handleRetry }),
    openRemoveLiqudityModal,
  ] as [Batch.Hook<RemoveLiquidityModalDataStep>, () => void];
};
