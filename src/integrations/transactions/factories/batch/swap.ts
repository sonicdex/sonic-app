import { MODALS } from '@/modals';
import { useModalStore, useSwapStore } from '@/store';
import { parseAmount } from '@/utils/format';
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
  } = useModalStore();

  if (!sonicBalances) throw new Error('Sonic balance are required');

  if (!swapParams.from.token || !swapParams.to.token)
    throw new Error('Tokens are required');

  const navigate = useNavigate();

  const depositParams = {
    token: swapParams.from.token,
    amount: swapParams.from.value,
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
      const sonicTokenBalance = swapParams.from.token
        ? sonicBalances[swapParams.from.token.id]
        : 0;
      const neededBalance = Number(
        parseAmount(swapParams.from.value, swapParams.from.token.decimals)
      );
      if (sonicTokenBalance < neededBalance) {
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
      setCurrentModal(MODALS.swapFailed);
    });
  };

  const openSwapModal = () => {
    setCurrentModalData({
      steps: Object.keys(transactions),
      fromToken: swapParams.from.token?.symbol,
      toToken: swapParams.to.token?.symbol,
    });
    setCurrentModal(MODALS.swapProgress);
  };

  return [
    useBatchHook<SwapBatchStep>({ transactions, handleRetry }),
    openSwapModal,
  ] as [Batch.Hook<SwapBatchStep>, () => void];
};
