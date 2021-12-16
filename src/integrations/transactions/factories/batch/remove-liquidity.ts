import {
  modalsSliceActions,
  RemoveLiquidityModalDataStep,
  useAppDispatch,
  useSwapStore,
} from '@/store';

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useBatchHook,
  useMemorizedWithdrawTransaction,
  useMemorizedRemoveLiquidityTransaction,
} from '..';
import { Batch, RemoveLiquidity } from '../..';

type RemoveLiquidityBatchStep = 'removeLiquidity' | 'withdraw';

export interface UseRemoveLiquidityBatchOptions extends RemoveLiquidity {
  keepInSonic: boolean;
}

export const useRemoveLiquidityBatch = ({
  keepInSonic,
  ...removeLiquidityParams
}: UseRemoveLiquidityBatchOptions) => {
  const dispatch = useAppDispatch();
  const { sonicBalances } = useSwapStore();

  if (!sonicBalances) {
    throw new Error('Sonic balance are required');
  }

  if (
    !removeLiquidityParams.token0.token ||
    !removeLiquidityParams.token1.token
  ) {
    throw new Error('Tokens are required');
  }

  const navigate = useNavigate();

  const withdrawParams = {
    token: removeLiquidityParams.token1.token,
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
              navigate(
                `/assets/withdraw?tokenId=${removeLiquidityParams.token0.token?.id}&amount=${removeLiquidityParams.token0.value}`
              );
              resolve(false);
            },
          ],
        })
      );
      dispatch(modalsSliceActions.openRemoveLiquidityFailModal());
    });
  };

  const openRemoveLiqudityModal = () => {
    dispatch(
      modalsSliceActions.setRemoveLiquidityData({
        steps: Object.keys(transactions) as RemoveLiquidityModalDataStep[],
        token0Symbol: removeLiquidityParams.token0.token?.symbol,
        token1Symbol: removeLiquidityParams.token1.token?.symbol,
      })
    );

    dispatch(modalsSliceActions.openRemoveLiquidityProgressModal());
  };

  return [
    useBatchHook<RemoveLiquidityBatchStep>({ transactions, handleRetry }),
    openRemoveLiqudityModal,
  ] as [Batch.Hook<RemoveLiquidityBatchStep>, () => void];
};
