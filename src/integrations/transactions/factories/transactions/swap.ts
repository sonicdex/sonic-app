import { Principal } from '@dfinity/principal';
import { Transaction } from '@psychedelic/plug-inpage-provider/dist/src/Provider';
import { useMemo } from 'react';

import { ENV } from '@/config';
import { SwapIDL } from '@/did';
import { getAmountMin, parseAmount } from '@/utils/format';

import { CreateTransaction, Swap } from '../../models';

export type SwapTransaction = Transaction;

export interface SwapExtraArgs {
  principal: Principal;
}

export const useSwapExactTokensTransactionMemo: CreateTransaction<Swap> = (
  { from, to, slippage, principalId }: Swap,
  onSuccess,
  onFail
) =>
  useMemo(() => {
    if (!from.metadata || !to.metadata) throw new Error('Tokens are required');
    if (!principalId) throw new Error('Principal is required');

    const amountIn = parseAmount(from.value, from.metadata.decimals);
    const amountOutMin = parseAmount(
      getAmountMin(to.value, slippage, to.metadata.decimals),
      to.metadata.decimals
    );
    const currentTime = (new Date().getTime() + 5 * 60 * 1000) * 10000000;

    return {
      canisterId: ENV.canistersPrincipalIDs.swap,
      idl: SwapIDL.factory,
      methodName: 'swapExactTokensForTokens',
      onFail,
      onSuccess: async (res: SwapIDL.Result) => {
        if ('err' in res) throw new Error(res.err);
        if (onSuccess) onSuccess(res);
      },
      args: [
        amountIn,
        amountOutMin,
        from.metadata.paths[to.metadata.id].path,
        Principal.fromText(principalId),
        BigInt(currentTime),
      ],
    };
  }, [from, to, slippage]);

export const useSwapForExactTokensTransactionMemo: CreateTransaction<Swap> = (
  { from, to, slippage, principalId }: Swap,
  onSuccess,
  onFail
) =>
  useMemo(() => {
    if (!from.metadata || !to.metadata) throw new Error('Tokens are required');
    if (!principalId) throw new Error('Principal is required');

    const amountOut = parseAmount(to.value, to.metadata.decimals);
    const amountInMin = parseAmount(
      getAmountMin(from.value, slippage, from.metadata.decimals),
      to.metadata.decimals
    );
    const currentTime = (new Date().getTime() + 5 * 60 * 1000) * 10000000;

    return {
      canisterId: ENV.canistersPrincipalIDs.swap,
      idl: SwapIDL.factory,
      methodName: 'swapTokensForExactTokens',
      onFail,
      onSuccess: async (res: SwapIDL.Result) => {
        if ('err' in res) throw new Error(res.err);
        onSuccess(res);
      },
      args: [
        amountOut,
        amountInMin,
        [from.metadata.id, to.metadata.id],
        Principal.fromText(principalId),
        BigInt(currentTime),
      ],
    };
  }, [from, to, slippage]);
