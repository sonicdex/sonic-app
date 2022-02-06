import { useMemo, useState } from 'react';

import { plug } from '@/integrations/plug';

import { BatchTransactions } from '..';
import { Batch } from '../models';

export const useBatchHook = <Model>({
  transactions,
  handleRetry,
}: Batch.HookProps<Model>): Batch.Hook<Model> => {
  const [state, setState] = useState(Batch.DefaultHookState.Idle);
  const [error, setError] = useState<unknown>();

  const handleError = (error: unknown): void => {
    setError(error);
    setState(Batch.DefaultHookState.Error);
  };

  const states = useMemo(
    () => Object.keys(transactions) as Batch.DefaultHookState[],
    [transactions]
  );

  const batch = useMemo(() => {
    const newBatch = new BatchTransactions(plug, handleRetry);

    const transactionsList = Object.values(transactions);

    Object.values(transactions).forEach((transaction, index) => {
      const onSuccess = transaction.onSuccess;
      transaction.onSuccess = async (res) => {
        let txSuccessResponse;
        if (onSuccess) {
          txSuccessResponse = await onSuccess(res);
        }
        if (index !== transactionsList.length - 1) {
          setState(states[index + 1]);
        } else {
          setState(Batch.DefaultHookState.Done);
        }

        return txSuccessResponse;
      };

      const onFail = transaction.onFail;
      transaction.onFail = async (err, prevRes) => {
        if (onFail) await onFail(err, prevRes);
        handleError(err);
      };
      newBatch.push(transaction);
    });

    return newBatch;
  }, [transactions, handleRetry]);

  const execute = async (): Promise<unknown> => {
    if (
      state !== Batch.DefaultHookState.Idle &&
      state !== Batch.DefaultHookState.Error
    ) {
      return Promise.reject('Batch is not idle');
    }
    setState(states[0]);
    try {
      return await batch.execute();
    } catch (error: any) {
      // TODO: Improve rejection flow to support other providers
      if (error.message === 'The transactions was rejected.') {
        setState(Batch.DefaultHookState.Error);
      }
      throw error;
    }
  };

  return {
    execute,
    state,
    error,
  };
};
