import {
  useMemorizedApproveTransaction,
  useMemorizedWithdrawTransaction,
  useBatchHook,
} from '..';
import { Withdraw } from '../..';

export const useWithdrawBatch = (withdraw: Withdraw) =>
  useBatchHook({
    transactions: {
      approve: useMemorizedApproveTransaction(withdraw),
      withdraw: useMemorizedWithdrawTransaction(withdraw),
    },
  });
