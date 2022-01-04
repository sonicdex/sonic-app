import { Principal } from '@dfinity/principal';
import { Transaction } from '@psychedelic/plug-inpage-provider/dist/src/Provider';
import { useMemo } from 'react';

import { ENV } from '@/config';
import { SwapIDL } from '@/did';
import { getAmountMin, parseAmount } from '@/utils/format';

import { AddLiquidity, CreateTransaction, RemoveLiquidity } from '../../models';

export type LiquidityTransaction = Transaction

export interface LiquidityExtraArgs {
  principal: Principal;
}

export const useAddLiquidityTransactionMemo: CreateTransaction<AddLiquidity> = (
  { token0, token1, slippage }: AddLiquidity,
  onSuccess,
  onFail
) =>
  useMemo(() => {
    if (!token0.metadata || !token1.metadata)
      throw new Error('Tokens are required');

    const amount0Desired = parseAmount(token0.value, token0.metadata.decimals);
    const amount1Desired = parseAmount(token1.value, token1.metadata.decimals);

    const amount0Min = parseAmount(
      getAmountMin(token1.value, slippage, token1.metadata.decimals),
      token1.metadata.decimals
    );
    const amount1Min = parseAmount(
      getAmountMin(token1.value, slippage, token1.metadata.decimals),
      token1.metadata.decimals
    );

    const currentTime = (new Date().getTime() + 5 * 60 * 1000) * 10000000;

    return {
      canisterId: ENV.canisterIds.swap,
      idl: SwapIDL.factory,
      methodName: 'addLiquidity',
      onFail: async (res: SwapIDL.Result) => {
        if ('err' in res) throw new Error(res.err);
        if (onFail) onFail(res);
      },
      onSuccess: async (res: SwapIDL.Result) => {
        if ('err' in res) throw new Error(res.err);
        if (onSuccess) onSuccess(res);
      },
      args: [
        Principal.fromText(token0.metadata?.id),
        Principal.fromText(token1.metadata?.id),
        amount0Desired,
        amount1Desired,
        amount0Min,
        amount1Min,
        BigInt(currentTime),
      ],
    };
  }, [token0, token1, slippage]);

export const useRemoveLiquidityTransactionMemo: CreateTransaction<RemoveLiquidity> =
  (
    {
      token0,
      token1,
      amount0Min,
      amount1Min,
      lpAmount,
      principalId,
    }: RemoveLiquidity,
    onSuccess,
    onFail
  ) =>
    useMemo(() => {
      if (!token0 || !token1) throw new Error('Token IDs are required');
      if (!principalId) throw new Error('Principal is required');

      const currentTime = (new Date().getTime() + 5 * 60 * 1000) * 10000000;

      return {
        canisterId: ENV.canisterIds.swap,
        idl: SwapIDL.factory,
        methodName: 'removeLiquidity',
        onFail: async (res: SwapIDL.Result) => {
          console.error(res);
          if ('err' in res) throw new Error(res.err);
          if (onFail) onFail(res);
        },
        onSuccess: async (res: SwapIDL.Result) => {
          if ('err' in res) throw new Error(res.err);
          if (onSuccess) onSuccess(res);
        },
        args: [
          Principal.fromText(token0.metadata.id),
          Principal.fromText(token1.metadata.id),
          BigInt(Math.round(lpAmount)),
          parseAmount(String(amount0Min), token0.metadata.decimals),
          parseAmount(String(amount1Min), token1.metadata.decimals),
          Principal.fromText(principalId),
          BigInt(currentTime),
        ],
      };
    }, [token0, token1]);
