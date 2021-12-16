import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Modals } from '@/modals';
import { useModalStore, useSwapStore } from '@/store';
import { parseAmount } from '@/utils/format';

import {
  useMemorizedDepositTransaction,
  useMemorizedAddLiquidityTransaction,
  useBatchHook,
  useMemorizedApproveTransaction,
} from '..';
import { AddLiquidity, Batch } from '../..';

type AddLiquidityBatchStep = 'approve' | 'deposit' | 'addLiquidity';

export const useAddLiquidityBatch = (addLiquidityParams: AddLiquidity) => {
  const { sonicBalances } = useSwapStore();

  const {
    setCurrentModal,
    setModalCallbacks,
    setCurrentModalData,
    setOnClose,
  } = useModalStore();

  if (!sonicBalances) {
    throw new Error('Sonic balance are required');
  }

  if (!addLiquidityParams.token0.token || !addLiquidityParams.token1.token) {
    throw new Error('Tokens are required');
  }

  const navigate = useNavigate();

  const depositParams = {
    token: addLiquidityParams.token0.token,
    amount: addLiquidityParams.token0.value,
  };

  const approve = useMemorizedApproveTransaction(depositParams);
  const deposit = useMemorizedDepositTransaction(depositParams);
  const addLiquidity = useMemorizedAddLiquidityTransaction(addLiquidityParams);

  const transactions = useMemo(() => {
    let _transactions = {};

    if (addLiquidityParams.token0.token) {
      const sonicTokenBalance = addLiquidityParams.token0.token
        ? sonicBalances[addLiquidityParams.token0.token.id]
        : 0;
      const neededBalance = Number(
        parseAmount(
          addLiquidityParams.token0.value,
          addLiquidityParams.token0.token.decimals
        )
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
      addLiquidity,
    };

    return _transactions;
  }, [...Object.values(addLiquidityParams)]);

  const handleRetry = async () => {
    return new Promise<boolean>((resolve) => {
      setModalCallbacks([
        // Retry callback
        () => {
          openAddLiquidityModal();
          resolve(true);
        },
        // Not retry callback
        () => {
          navigate(
            `/assets/withdraw?tokenId=${addLiquidityParams.token0.token?.id}&amount=${addLiquidityParams.token0.value}`
          );
          resolve(false);
        },
      ]);
      setOnClose(() => resolve(false));
      setCurrentModal(Modals.SwapFailed);
    });
  };

  const openAddLiquidityModal = () => {
    setCurrentModalData({
      steps: Object.keys(transactions),
      token0: addLiquidityParams.token0.token?.symbol,
      token1: addLiquidityParams.token1.token?.symbol,
    });
    setCurrentModal(Modals.SwapProgress);
  };

  return [
    useBatchHook<AddLiquidityBatchStep>({ transactions, handleRetry }),
    openAddLiquidityModal,
  ] as [Batch.Hook<AddLiquidityBatchStep>, () => void];
};
