import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  modalsSliceActions,
  SwapModalDataStep,
  useAppDispatch,
  useSwapCanisterStore,
} from '@/store';

import { Batch, Swap } from '../..';
import {
  useApproveTransactionMemo,
  useBatchHook,
  useDepositTransactionMemo,
  useSwapExactTokensTransactionMemo,
  useWithdrawTransactionMemo,
} from '..';
import { getAmountDependsOnBalance, getDepositTransactions } from './utils';

export interface ExtraDepositSwapBatchOptions {
  keepInSonic: boolean;
}

export const useSwapBatch = ({
  keepInSonic,
  ...swapParams
}: Swap & ExtraDepositSwapBatchOptions) => {
  const dispatch = useAppDispatch();
  const { sonicBalances } = useSwapCanisterStore();

  console.log(swapParams);

  if (!sonicBalances) throw new Error('Sonic balance is required');

  if (!swapParams.from.metadata || !swapParams.to.metadata)
    throw new Error('Tokens are required');

  const navigate = useNavigate();

  const depositParams = {
    token: swapParams.from.metadata,
    amount: getAmountDependsOnBalance(
      sonicBalances[swapParams.from.metadata.id],
      swapParams.from.metadata.decimals,
      swapParams.from.value
    ),
  };
  const withdrawParams = {
    token: swapParams.to.metadata,
    amount: swapParams.to.value,
  };

  const approve = useApproveTransactionMemo(depositParams);
  const deposit = useDepositTransactionMemo(depositParams);
  const swap = useSwapExactTokensTransactionMemo(swapParams);
  const withdraw = useWithdrawTransactionMemo(withdrawParams);

  const transactions = useMemo(() => {
    let _transactions = {};

    _transactions = {
      ...getDepositTransactions({
        approveTx: approve,
        depositTx: deposit,
      }),
    };

    _transactions = {
      ..._transactions,
      swap,
    };

    if (!keepInSonic) {
      _transactions = {
        ..._transactions,
        withdraw,
      };
    }

    return _transactions;
  }, [...Object.values(swapParams), keepInSonic]);

  const handleRetry = async () => {
    return new Promise<boolean>((resolve) => {
      dispatch(
        modalsSliceActions.setSwapModalData({
          callbacks: [
            // Retry callback
            () => {
              openSwapModal();
              resolve(true);
            },
            // Withdraw callback
            () => {
              navigate(
                `/assets/withdraw?tokenId=${swapParams.from.metadata?.id}&amount=${swapParams.from.value}`
              );
              resolve(false);
            },
            // Close callback
            () => {
              resolve(false);
            },
          ],
        })
      );

      dispatch(modalsSliceActions.closeSwapProgressModal());
      dispatch(modalsSliceActions.openSwapFailModal());
    });
  };

  const openSwapModal = () => {
    dispatch(
      modalsSliceActions.setSwapModalData({
        steps: Object.keys(transactions) as SwapModalDataStep[],
        fromTokenSymbol: swapParams.from.metadata?.symbol,
        toTokenSymbol: swapParams.to.metadata?.symbol,
      })
    );

    dispatch(modalsSliceActions.openSwapProgressModal());
  };

  return [
    useBatchHook<SwapModalDataStep>({ transactions, handleRetry }),
    openSwapModal,
  ] as [Batch.Hook<SwapModalDataStep>, () => void];
};
