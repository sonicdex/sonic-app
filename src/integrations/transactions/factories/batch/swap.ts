import { Modals } from '@/components/modals';
import { useModalsStore, useSwapStore } from '@/store';
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

type SwapBatchStep = 'approve' | 'deposit' | 'swap' | 'withdraw';
export interface ExtraDepositSwapBatchOptions {
  keepInSonic: boolean;
}

export const useSwapBatch = ({
  keepInSonic,
  ...swapParams
}: Swap & ExtraDepositSwapBatchOptions) => {
  const { sonicBalances } = useSwapStore();

  const {
    setCurrentModal,
    setModalCallbacks,
    setCurrentModalData,
    setOnClose,
  } = useModalsStore();

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
      setModalCallbacks([
        // Retry callback
        () => {
          openSwapModal();
          resolve(true);
        },
        // Not retry callback
        () => {
          navigate(
            `/assets/withdraw?tokenId=${swapParams.from.token?.id}&amount=${swapParams.from.value}`
          );
          resolve(false);
        },
      ]);
      setOnClose(() => resolve(false));
      setCurrentModal(Modals.SwapFailed);
    });
  };

  const openSwapModal = () => {
    setCurrentModalData({
      steps: Object.keys(transactions),
      fromToken: swapParams.from.token?.symbol,
      toToken: swapParams.to.token?.symbol,
    });
    setCurrentModal(Modals.SwapProgress);
  };

  return [
    useBatchHook<SwapBatchStep>({ transactions, handleRetry }),
    openSwapModal,
  ] as [Batch.Hook<SwapBatchStep>, () => void];
};
