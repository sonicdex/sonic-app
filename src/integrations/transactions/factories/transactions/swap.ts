import { ENV } from '@/config';
import { SwapIDL } from '@/did';
import { getAmountMin, parseAmount } from '@/utils/format';
import { Principal } from '@dfinity/principal';
import { Transaction } from '@psychedelic/plug-inpage-provider/dist/src/Provider';
import { useMemo } from 'react';
import { CreateTransaction, Swap } from '../../models';

export interface SwapTransaction extends Transaction {}

export interface SwapExtraArgs {
  principal: Principal;
}

export const useMemorizedSwapExactTokensTransaction: CreateTransaction<Swap> = (
  { from, to, slippage, principalId }: Swap,
  onSuccess,
  onFail
) =>
  useMemo(() => {
    if (!from.token || !to.token) throw new Error('Tokens are required');
    if (!principalId) throw new Error('Principal is required');

    const amountIn = parseAmount(from.value, from.token.decimals);
    const amountOutMin = parseAmount(
      getAmountMin(to.value, slippage, to.token.decimals),
      to.token.decimals
    );
    const currentTime = (new Date().getTime() + 5 * 60 * 1000) * 10000000;

    return {
      canisterId: ENV.canisterIds.swap,
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
        [from.token.id, to.token.id],
        Principal.fromText(principalId),
        BigInt(currentTime),
      ],
    };
  }, [from, to, slippage]);

export const useMemorizedSwapForExactTokensTransaction: CreateTransaction<Swap> =
  ({ from, to, slippage, principalId }: Swap, onSuccess, onFail) =>
    useMemo(() => {
      if (!from.token || !to.token) throw new Error('Tokens are required');
      if (!principalId) throw new Error('Principal is required');

      const amountOut = parseAmount(to.value, to.token.decimals);
      const amountInMin = parseAmount(
        getAmountMin(from.value, slippage, from.token.decimals),
        to.token.decimals
      );
      const currentTime = (new Date().getTime() + 5 * 60 * 1000) * 10000000;

      return {
        canisterId: ENV.canisterIds.swap,
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
          [from.token.id, to.token.id],
          Principal.fromText(principalId),
          BigInt(currentTime),
        ],
      };
    }, [from, to, slippage]);
