import { useMemo, useState } from 'react';

import { plug } from '@/integrations/plug';

import { BatchTransactions } from '..';
import { Batch } from '../models';

export const useBatchHook: Batch.CreateHook = ({
  transactions,
  handleRetry,
}) => {
  const [state, setState] = useState<string>(Batch.DefaultHookState.Idle);
  const [error, setError] = useState<unknown>();

  const handleError = (error: unknown): void => {
    setError(error);
    setState(Batch.DefaultHookState.Error);
  };

  const states = useMemo(() => {
    return Object.keys(transactions);
  }, [transactions]);

  const batch = useMemo(() => {
    const newBatch = new BatchTransactions(plug, handleRetry);

    const transactionsList = Object.values(transactions);

    Object.values(transactions).forEach((transaction, index) => {
      const onSuccess = transaction.onSuccess;
      transaction.onSuccess = async (res) => {
        let txRes;
        if (onSuccess) {
          txRes = await onSuccess(res);
        }
        if (index !== transactionsList.length - 1) {
          setState(states[index + 1]);
        } else {
          setState(Batch.DefaultHookState.Done);
        }

        return txRes;
      };

      const onFail = transaction.onFail;
      transaction.onFail = async (err, prevRes) => {
        if (onFail) await onFail(err, prevRes);
        handleError(err);
      };
      newBatch.push(transaction);
    });

    return newBatch;
  }, [transactions]);

  const execute = (): Promise<unknown> => {
    if (state !== Batch.DefaultHookState.Idle) {
      return Promise.reject('Batch is not idle');
    }
    setState(states[0]);
    return batch.execute();
  };

  return {
    execute,
    state,
    error,
  };
};
