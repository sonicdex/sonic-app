import {
  createApproveTransaction,
  createDepositTransaction,
  createSwapTransaction,
  useBatchHook,
} from '..';
import { Swap } from '../..';

export const useDepositSwapBatch = (swap: Swap) => {
  if (!swap.from.token || !swap.to.token)
    throw new Error('Tokens are required');

  const deposit = {
    token: swap.from.token,
    amount: swap.from.value,
  };

  return useBatchHook({
    transactions: {
      approve: createApproveTransaction(deposit),
      deposit: createDepositTransaction(deposit),
      swap: createSwapTransaction(swap),
    },
  });
};
