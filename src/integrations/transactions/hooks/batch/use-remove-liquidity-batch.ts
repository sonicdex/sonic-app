import { useMemo } from 'react';

import {
  modalsSliceActions, RemoveLiquidityModalDataStep, useAppDispatch, 
} from '@/store';

import { RemoveLiquidity } from '../..';
import { useRemoveLiquidityTransactionMemo, token0Withdraw, useWithdrawTransactionMemo ,  } from '..';

export interface UseRemoveLiquidityBatchOptions extends RemoveLiquidity {
  keepInSonic: boolean;
}


import { BatchTransact } from 'artemis-web3-adapter';
import { artemis } from '@/integrations/artemis';


export const useRemoveLiquidityBatch = ({ keepInSonic, ...removeLiquidityParams }: UseRemoveLiquidityBatchOptions) => {
  const dispatch = useAppDispatch();
 // const { sonicBalances } = useSwapCanisterStore();

  var batchLoad: any = { state: "idle" };

  // if (!sonicBalances) {
  //   return { batch: batchLoad, openBatchModal: () => { } };
  // }

  if (!removeLiquidityParams.token0.metadata || !removeLiquidityParams.token1.metadata) {
    return { batch: batchLoad, openBatchModal: () => { } };
  }
  var RemoveLiquidityBatch = { batch: batchLoad, openBatchModal: () => { } };

  const withdraw0Params = {
    token: removeLiquidityParams.token0.metadata,
    amount: removeLiquidityParams.amount0Min.toString(),
  };

  const withdraw1Params = {
    token: removeLiquidityParams.token1.metadata,
    amount: removeLiquidityParams.amount1Min.toString(),
  };

  const removeLiquidity = useRemoveLiquidityTransactionMemo(removeLiquidityParams);
  const withdraw0 = token0Withdraw(withdraw0Params);
  const withdraw1 = useWithdrawTransactionMemo(withdraw1Params);

  const LiquidityBatchTx = useMemo(() => {
    let _transactions: any = { removeLiquidity };
    if (!keepInSonic) {
      _transactions = { ..._transactions, withdraw0, withdraw1 };
    }
    return new BatchTransact(_transactions, artemis);
    // return _transactions;
  }, [...Object.values(removeLiquidityParams), keepInSonic]);



  const handleRetry = async () => {
    return new Promise<boolean>((resolve) => {
      dispatch(
        modalsSliceActions.setRemoveLiquidityModalData({
          callbacks: [
            // Retry callback
            () => {
              dispatch(modalsSliceActions.closeRemoveLiquidityFailModal());
              openBatchModal();
              resolve(true);
            },
            // Not retry callback
            () => {
              dispatch(modalsSliceActions.closeRemoveLiquidityFailModal());
              resolve(false);
            },
          ],
        })
      );
      dispatch(modalsSliceActions.closeRemoveLiquidityProgressModal());
      dispatch(modalsSliceActions.openRemoveLiquidityFailModal());
    });
  };

  const openBatchModal = () => {
    dispatch(
      modalsSliceActions.setRemoveLiquidityModalData({
        steps: LiquidityBatchTx.stepsList as RemoveLiquidityModalDataStep[],
        token0Symbol: removeLiquidityParams.token0.metadata?.symbol,
        token1Symbol: removeLiquidityParams.token1.metadata?.symbol,
      })
    );
    dispatch(modalsSliceActions.openRemoveLiquidityProgressModal());
  };
 
  if (LiquidityBatchTx) {
    batchLoad.batchExecute = LiquidityBatchTx;
    batchLoad.handleRetry = handleRetry;
    batchLoad.batchFnUpdate = false;
  }
  return RemoveLiquidityBatch = { ...RemoveLiquidityBatch, batch: batchLoad, openBatchModal };
};
