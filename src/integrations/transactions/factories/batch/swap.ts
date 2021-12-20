import {
  modalsSliceActions,
  SwapModalDataStep,
  useAppDispatch,
  useSwapCanisterStore,
} from '@/store';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useMemorizedApproveTransaction,
  useMemorizedDepositTransaction,
  useMemorizedSwapExactTokensTransaction,
  useMemorizedWithdrawTransaction,
  useBatchHook,
} from '..';
import { Batch, Swap } from '../..';
import { getDepositTransactions, getToDepositAmount } from './utils';

export interface ExtraDepositSwapBatchOptions {
  keepInSonic: boolean;
}

export const useSwapBatch = ({
  keepInSonic,
  ...swapParams
}: Swap & ExtraDepositSwapBatchOptions) => {
  const dispatch = useAppDispatch();
  const { sonicBalances } = useSwapCanisterStore();

  if (!sonicBalances) throw new Error('Sonic balance are required');

  if (!swapParams.from.metadata || !swapParams.to.metadata)
    throw new Error('Tokens are required');

  const navigate = useNavigate();

  const depositParams = {
    token: swapParams.from.metadata,
    amount: getToDepositAmount(
      sonicBalances[swapParams.from.metadata.id],
      swapParams.from.metadata.decimals,
      swapParams.from.value
    ),
  };
  const withdrawParams = {
    token: swapParams.to.metadata,
    amount: swapParams.to.value,
  };

  const approve = useMemorizedApproveTransaction(depositParams);
  const deposit = useMemorizedDepositTransaction(depositParams);
  const swap = useMemorizedSwapExactTokensTransaction(swapParams);
  const withdraw = useMemorizedWithdrawTransaction(withdrawParams);

  const transactions = useMemo(() => {
    let _transactions = {};

    if (swapParams.from.metadata) {
      _transactions = {
        ...getDepositTransactions({
          approveTx: approve,
          depositTx: deposit,
        }),
      };
    }

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
        modalsSliceActions.setSwapData({
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
      modalsSliceActions.setSwapData({
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
