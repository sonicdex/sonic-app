import {
  createApproveTransaction,
  createDepositTransaction,
  useBatchHook,
} from '..';
import { Deposit } from '../..';

export const useDepositBatch = (deposit: Deposit) =>
  useBatchHook({
    states: {
      Idle: 'idle',
      Done: 'done',
      Error: 'error',
      0: 'approve',
      1: 'deposit',
    },
    transactions: [
      createApproveTransaction(deposit),
      createDepositTransaction(deposit),
    ],
  });
