import { useMemorizedWithdrawTransaction, useBatchHook } from '..';
import { Withdraw } from '../..';

export const useWithdrawBatch = (withdraw: Withdraw) =>
  useBatchHook({
    transactions: {
      withdraw: useMemorizedWithdrawTransaction(withdraw),
    },
  });
