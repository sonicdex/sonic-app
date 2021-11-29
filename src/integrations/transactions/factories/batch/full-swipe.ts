import { plug } from '@/integrations/plug';
import { Principal } from '@dfinity/principal';
import {
  createDepositTransaction,
  createSwapTransaction,
  createWithdrawTransaction,
} from '..';
import { BatchTransactions } from '../../batch-transactions';

export const createFullSwipe = (): BatchTransactions => {
  const batch = new BatchTransactions(plug);
  // TODO: create correct transactions

  batch.push(createDepositTransaction(null));
  batch.push(createSwapTransaction(null));
  batch.push(createWithdrawTransaction(null));

  return batch;
};
