import { plug } from '@/integrations/plug';
import { useMemo, useState } from 'react';
import { BatchTransactions } from '..';
import { Batch } from '../models';

export const createBatchHook: Batch.CreateHook = ({ states, transactions }) => {
  const [state, setState] = useState<string>(states.Idle);
  const [error, setError] = useState<unknown>();

  const handleError = (error: unknown): void => {
    setError(error);
    setState(states.Error);
  };

  const batch = useMemo(() => {
    const newBatch = new BatchTransactions(plug, async () =>
      // TODO: create handle retry modal
      confirm('Transaction failed, try again?')
    );

    transactions.forEach((transaction, index) => {
      const onSuccess = transaction.onSuccess;
      transaction.onSuccess = async (res) => {
        if (onSuccess) onSuccess(res);
        if (index !== transactions.length - 1) {
          setState(states[index + 1]);
        } else {
          setState(states.Done);
        }
      };

      const onFail = transaction.onFail;
      transaction.onFail = async (res) => {
        if (onFail) onFail(res);
        transaction.onFail(res);
        handleError(res);
      };
      newBatch.push(transaction);
    });

    return newBatch;
  }, []);

  const execute = (): Promise<unknown> => {
    if (Object.keys(states).length !== transactions.length + 3) {
      return Promise.reject('Invalid states');
    }
    if (state !== states.Idle) {
      return Promise.reject('Batch is not idle');
    }
    setState(states[0]);
    return batch.execute();
  };

  return {
    execute,
    state: state as any,
    error,
  };
};
