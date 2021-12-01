import { plug } from '@/integrations/plug';
import {
  createDepositTransaction,
  createSwapTransaction,
  createWithdrawTransaction,
} from '..';
import { BatchTransactions } from '../../batch-transactions';

export const createFullSwap = (): BatchTransactions => {
  // Create a new batch of transactions
  const batch = new BatchTransactions(plug, async () => {
    return confirm('Failed. Try again?');
  });

  // Add transactions
  batch.push(createDepositTransaction(null));
  batch.push(
    createSwapTransaction(
      null,
      // We can use callbacks for each of transactions
      (res) => console.log(`response for this transaction was ${res}`) as any,
      (err) => console.log(`error for this transaction was ${err}`) as any
    )
  );
  batch.push(createWithdrawTransaction(null));

  // Execute all transactions
  batch
    .execute()
    .then((res) => {
      console.log('handle batch success', res);
    })
    .catch((err) => {
      console.log('handle batch error', err);
    });

  return batch;
};
