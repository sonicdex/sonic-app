import {
  modalsSliceActions,
  SwapModalDataStep,
  useAppDispatch,
  useSwapStore,
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
import { getToDepositAmount } from './utils';

export interface ExtraDepositSwapBatchOptions {
  keepInSonic: boolean;
}

export const useSwapBatch = ({
  keepInSonic,
  ...swapParams
}: Swap & ExtraDepositSwapBatchOptions) => {
  const dispatch = useAppDispatch();
  const { sonicBalances } = useSwapStore();

  if (!sonicBalances) throw new Error('Sonic balance are required');

  if (!swapParams.from.token || !swapParams.to.token)
    throw new Error('Tokens are required');

  const navigate = useNavigate();

  const depositParams = {
    token: swapParams.from.token,
    amount: getToDepositAmount(
      sonicBalances[swapParams.from.token.id],
      swapParams.from.token.decimals,
      swapParams.from.value
    ),
  };
  const withdrawParams = {
    token: swapParams.to.token,
    amount: swapParams.to.value,
  };

  const approve = useMemorizedApproveTransaction(depositParams);
  const deposit = useMemorizedDepositTransaction(depositParams);
  const swap = useMemorizedSwapExactTokensTransaction(swapParams);
  const withdraw = useMemorizedWithdrawTransaction(withdrawParams);

  const transactions = useMemo(() => {
    let _transactions = {};

    if (swapParams.from.token) {
      const neededBalance = Number(parseFloat(depositParams.amount));
      if (neededBalance > 0) {
        _transactions = {
          approve,
          deposit,
        };
      }
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
                `/assets/withdraw?tokenId=${swapParams.from.token?.id}&amount=${swapParams.from.value}`
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
        fromTokenSymbol: swapParams.from.token?.symbol,
        toTokenSymbol: swapParams.to.token?.symbol,
      })
    );

    dispatch(modalsSliceActions.openSwapProgressModal());
  };

  return [
    useBatchHook<SwapModalDataStep>({ transactions, handleRetry }),
    openSwapModal,
  ] as [Batch.Hook<SwapModalDataStep>, () => void];
};
