import {
  createApproveTransaction,
  createDepositTransaction,
  useBatchHook,
} from '..';
import { Deposit } from '../..';

export const useDepositBatch = (deposit: Deposit) =>
  useBatchHook({
    transactions: {
      approve: createApproveTransaction(deposit),
      deposit: createDepositTransaction(deposit),
    },
  });
