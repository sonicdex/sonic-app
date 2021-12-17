import { ENV } from '@/config';
import { SwapIDL } from '@/did';
import { getMinAmount, parseAmount } from '@/utils/format';
import { Principal } from '@dfinity/principal';
import { Transaction } from '@psychedelic/plug-inpage-provider/dist/src/Provider';
import { useMemo } from 'react';
import { CreateTransaction, AddLiquidity, RemoveLiquidity } from '../../models';

export interface LiquidityTransaction extends Transaction {}

export interface LiquidityExtraArgs {
  principal: Principal;
}

export const useMemorizedAddLiquidityTransaction: CreateTransaction<AddLiquidity> =
  ({ token0, token1, slippage }: AddLiquidity, onSuccess, onFail) =>
    useMemo(() => {
      if (!token0.token || !token1.token)
        throw new Error('Tokens are required');

      const amount0Desired = parseAmount(token0.value, token0.token.decimals);
      const amount1Desired = parseAmount(token1.value, token1.token.decimals);

      const amount0Min = parseAmount(
        getMinAmount(token1.value, slippage, token1.token.decimals),
        token1.token.decimals
      );
      const amount1Min = parseAmount(
        getMinAmount(token1.value, slippage, token1.token.decimals),
        token1.token.decimals
      );

      const currentTime = (new Date().getTime() + 5 * 60 * 1000) * 10000000;

      return {
        canisterId: ENV.canisterIds.swap,
        idl: SwapIDL.factory,
        methodName: 'addLiquidity',
        onFail,
        onSuccess: async (res: SwapIDL.Result) => {
          if ('err' in res) throw new Error(res.err);
          if (onSuccess) onSuccess(res);
        },
        args: [
          Principal.fromText(token0.token?.id),
          Principal.fromText(token1.token?.id),
          amount0Desired,
          amount1Desired,
          amount0Min,
          amount1Min,
          BigInt(currentTime),
        ],
      };
    }, [token0, token1, slippage]);

export const useMemorizedRemoveLiquidityTransaction: CreateTransaction<RemoveLiquidity> =
  (
    { token0, token1, slippage, lpAmount, principalId }: RemoveLiquidity,
    onSuccess,
    onFail
  ) =>
    useMemo(() => {
      if (!token0.token || !token1.token)
        throw new Error('Tokens are required');
      if (!principalId) throw new Error('Principal is required');

      const currentTime = (new Date().getTime() + 5 * 60 * 1000) * 10000000;

      const amount0Desired = parseAmount(token0.value, token0.token.decimals);
      const amount1Desired = parseAmount(token1.value, token1.token.decimals);

      return {
        canisterId: ENV.canisterIds.swap,
        idl: SwapIDL.factory,
        methodName: 'removeLiquidity',
        onFail,
        onSuccess: async (res: SwapIDL.Result) => {
          if ('err' in res) throw new Error(res.err);
          if (onSuccess) onSuccess(res);
        },
        args: [
          Principal.fromText(token0.token?.id),
          Principal.fromText(token1.token?.id),
          lpAmount,
          amount0Desired,
          amount1Desired,
          Principal.fromText(principalId),
          BigInt(currentTime),
        ],
      };
    }, [token0, token1]);
