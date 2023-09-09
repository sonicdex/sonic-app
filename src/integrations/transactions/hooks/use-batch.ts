import { useMemo, useState } from 'react';

import { Batch } from '../models';

import { BatchTransact } from 'artemis-web3-adapter';
import { artemis } from '@/integrations/artemis';

export const useBatch = <Model>({
  transactions, handleRetry
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
    const transactionsList = Object.values(transactions);
    const newBatch = new BatchTransact(artemis,transactionsList);
    
    Object.values(transactions).forEach((transaction, index) => {
      const onSuccess = transaction.onSuccess;
      transaction.onSuccess = async (res:any) => {
        let txSuccessResponse;
        if (onSuccess) { txSuccessResponse = await onSuccess(res); }
        if (index !== transactionsList.length - 1) {
          setState(states[index + 1]);
        } else {
          setState(Batch.DefaultHookState.Done);
        }
        return txSuccessResponse;
      };
      const onFail = transaction.onFail;
      transaction.onFail = async (err:any, prevRes:any) => {
        if (onFail) await onFail(err, prevRes);
        handleError(err);
      };
      //newBatch.push(transaction);
    });
    return newBatch;
  }, [transactions, handleRetry]);

  var execute = async (): Promise<unknown> => {
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
  return { execute, state, error };
};
