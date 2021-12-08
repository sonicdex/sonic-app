import { useBalances } from '@/hooks/use-balances';
import { parseAmount } from '@/utils/format';
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
  ...swap
}: Swap & ExtraDepositSwapBatchOptions) => {
  const { sonicBalance } = useBalances();
  if (!sonicBalance) throw new Error('Sonic balance is needed');

  if (!swap.from.token || !swap.to.token)
    throw new Error('Tokens are required');

  let transactions = {};

  if (
    sonicBalance[swap.from.token.id] <
    Number(parseAmount(swap.from.value, swap.from.token.decimals))
  ) {
    const deposit = {
      token: swap.from.token,
      amount: swap.from.value,
    };

    transactions = {
      approve: createApproveTransaction(deposit, async (res: unknown) =>
        console.log('Approve', res)
      ),
      deposit: createDepositTransaction(deposit, async (res: unknown) =>
        console.log('Deposit', res)
      ),
    };
  }

  transactions = {
    ...transactions,
    swap: createSwapExactTokensTransaction(swap, async (res: unknown) =>
      console.log('Swap', res)
    ),
  };

  if (!keepInSonic) {
    const withdraw = {
      token: swap.to.token,
      amount: swap.to.value,
    };

    transactions = {
      ...transactions,
      withdraw: createWithdrawTransaction(withdraw, async (res: unknown) =>
        console.log('Withdraw', res)
      ),
    };
  }

  return useBatchHook({ transactions });
};
