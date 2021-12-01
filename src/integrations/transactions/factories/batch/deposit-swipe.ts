import { plug } from '@/integrations/plug';
import { amountInMax, amountOutMin } from '@/utils/format';
import { Principal } from '@dfinity/principal';
import { useState } from 'react';
import { createDepositTransaction, createSwapTransaction } from '..';
import { BatchTransactions } from '../..';
import { CreateBatch } from '../../models/create-batch';

interface DepositSwapParams {
  tokenIn: TokenAdded;
  tokenOut: TokenAdded;
  tolerance: number;
  fromValue: number;
  toValue: number;
}

enum DepositSwapState {
  Idle = 'idle',
  Depositing = 'depositing',
  Swapping = 'swapping',
  Done = 'done',
  Error = 'error',
}

export const createDepositSwipe: CreateBatch<DepositSwapParams> = ({
  fromValue,
  tokenIn,
  tokenOut,
  tolerance,
  toValue,
}): any => {
  const [state, setState] = useState(DepositSwapState.Idle);
  const [error, setError] = useState<unknown>();

  // TODO: add handle retry
  const batch = new BatchTransactions(plug, async () =>
    confirm('Transaction failed, try again?')
  );

  const handleError = async (error: unknown) => {
    setError(error);
    setState(DepositSwapState.Error);
  };

  batch.push(
    createDepositTransaction(
      {
        amount: fromValue,
        tokenId: tokenIn.canisterId,
      },
      async () => setState(DepositSwapState.Swapping),
      handleError
    )
  );

  batch.push(
    createSwapTransaction(
      {
        tokenIn: tokenIn.canisterId,
        amountIn: String(fromValue),
        amountInMax: amountInMax(fromValue, tolerance, tokenIn.decimals),
        amountOut: String(toValue),
        tokenOut: tokenOut.canisterId,
        amountOutMin: amountOutMin(toValue, tolerance, tokenOut.decimals),
        decimalIn: tokenIn.decimals,
        decimalOut: tokenOut.decimals,
      },
      async () => setState(DepositSwapState.Done),
      handleError
    )
  );

  const execute = (): Promise<unknown> => {
    setState(DepositSwapState.Depositing);
    return batch.execute();
  };

  return {
    execute,
    state,
    error,
  };
};
