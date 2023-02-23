import { Principal } from '@dfinity/principal';
import { Transaction } from '@memecake/plug-inpage-provider/dist/src/Provider/interfaces';
import { Swap } from '@memecake/sonic-js';
import { useMemo } from 'react';

import { ENV } from '@/config';
import { SwapIDL } from '@/did';
import { parseAmount } from '@/utils/format';

import { CreateTransaction, SwapModel } from '../../models';

export type SwapTransaction = Transaction;

export interface SwapExtraArgs {
  principal: Principal;
}

export const useSwapExactTokensTransactionMemo: CreateTransaction<SwapModel> = (
  { from, to, slippage, principalId }: SwapModel,
  onSuccess,
  onFail
) =>
  useMemo(() => {
    if (!from.metadata || !to.metadata) throw new Error('Tokens are required');
    if (!principalId) throw new Error('Principal is required');

    const amountIn = parseAmount(from.value, from.metadata.decimals);
    const amountOutMin = parseAmount(
      Swap.getAmountMin({
        amount: to.value,
        slippage,
        decimals: to.metadata.decimals,
      }).toString(),
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
        from.paths[to.metadata.id]?.path,
        Principal.fromText(principalId),
        BigInt(currentTime),
      ],
    };
  }, [
    from.metadata,
    from.value,
    from.paths,
    to.metadata,
    to.value,
    principalId,
    slippage,
    onFail,
    onSuccess,
  ]);

export const useSwapForExactTokensTransactionMemo: CreateTransaction<
  SwapModel
> = ({ from, to, slippage, principalId }: SwapModel, onSuccess, onFail) =>
  useMemo(() => {
    if (!from.metadata || !to.metadata) throw new Error('Tokens are required');
    if (!principalId) throw new Error('Principal is required');

    const amountOut = parseAmount(to.value, to.metadata.decimals);
    const amountInMin = parseAmount(
      Swap.getAmountMin({
        amount: from.value,
        slippage,
        decimals: from.metadata.decimals,
      }).toString(),
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
  }, [
    from.metadata,
    from.value,
    to.metadata,
    to.value,
    principalId,
    slippage,
    onFail,
    onSuccess,
  ]);
