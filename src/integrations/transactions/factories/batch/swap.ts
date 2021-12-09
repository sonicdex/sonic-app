import { useBalances } from '@/hooks/use-balances';
import { parseAmount } from '@/utils/format';
import { useMemo } from 'react';
import {
  createApproveTransaction,
  createDepositTransaction,
  createSwapExactTokensTransaction,
  createWithdrawTransaction,
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
  const { sonicBalance } = useBalances();
  if (!sonicBalance) throw new Error('Sonic balance is needed');

  if (!swapParams.from.token || !swapParams.to.token)
    throw new Error('Tokens are required');

  const depositParams = {
    token: swapParams.from.token,
    amount: swapParams.from.value,
  };
  const withdrawParams = {
    token: swapParams.to.token,
    amount: swapParams.to.value,
  };

  const approve = createApproveTransaction(
    depositParams,
    async (res: unknown) => console.log('Approve', res)
  );
  const deposit = createDepositTransaction(
    depositParams,
    async (res: unknown) => console.log('Deposit', res)
  );
  const swap = createSwapExactTokensTransaction(
    swapParams,
    async (res: unknown) => console.log('Swap', res)
  );
  const withdraw = createWithdrawTransaction(
    withdrawParams,
    async (res: unknown) => console.log('Withdraw', res)
  );

  const transactions = useMemo(() => {
    let _transactions = {};

    if (swapParams.from.token) {
      const sonicTokenBalance = swapParams.from.token
        ? sonicBalance[swapParams.from.token.id]
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
