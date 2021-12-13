import { useModalStore, useSwapStore } from '@/store';
import { parseAmount } from '@/utils/format';
import { useMemo } from 'react';
import {
  useMemorizedApproveTransaction,
  useMemorizedDepositTransaction,
  useMemorizedSwapExactTokensTransaction,
  useMemorizedWithdrawTransaction,
  useBatchHook,
} from '..';
import { Swap } from '../..';

export interface ExtraDepositSwapBatchOptions {
  keepInSonic: boolean;
}

export const useSwapBatch = ({
  keepInSonic,
  ...swapParams
}: Swap & ExtraDepositSwapBatchOptions) => {
  const { sonicBalances } = useSwapStore();
  if (!sonicBalances) throw new Error('Sonic balance are required');

  if (!swapParams.from.token || !swapParams.to.token)
    throw new Error('Tokens are required');

  const { setCurrentModalState, clearModal } = useModalStore();

  const depositParams = {
    token: swapParams.from.token,
    amount: swapParams.from.value,
  };
  const withdrawParams = {
    token: swapParams.to.token,
    amount: swapParams.to.value,
  };

  const approve = useMemorizedApproveTransaction(depositParams, () =>
    setCurrentModalState('deposit')
  );
  const deposit = useMemorizedDepositTransaction(depositParams, () =>
    setCurrentModalState('swap')
  );
  const swap = useMemorizedSwapExactTokensTransaction(swapParams, () =>
    setCurrentModalState('withdraw')
  );
  const withdraw = useMemorizedWithdrawTransaction(withdrawParams, () =>
    clearModal()
  );

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

  return useBatchHook({ transactions });
};
