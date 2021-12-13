import {
  useMemorizedApproveTransaction,
  useMemorizedDepositTransaction,
  useBatchHook,
} from '..';
import { Deposit } from '../..';

export const useDepositBatch = (deposit: Deposit) =>
  useBatchHook({
    transactions: {
      approve: useMemorizedApproveTransaction(deposit),
      deposit: useMemorizedDepositTransaction(deposit),
    },
  });
