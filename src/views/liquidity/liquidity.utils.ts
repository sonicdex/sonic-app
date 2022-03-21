import { Liquidity, toBigNumber } from '@psychedelic/sonic-js';
import { useMemo } from 'react';

import { AppAssetSource, getAppAssetsSources } from '@/config/utils';
import { SwapIDL } from '@/did';
import { Balances, BaseTokenData } from '@/models';

export const getShareOfPoolString = (
  params: Liquidity.GetShareOfPoolParams
) => {
  const percentage = Liquidity.getShareOfPool(params).multipliedBy(100);

  if (percentage.isEqualTo(0)) return '0%';

  if (percentage.isLessThanOrEqualTo(0.01)) {
    return '<0.01%';
  }

  return `${percentage.toFixed(2)}%`;
};

export interface AddLiquidityMemoParams {
  token0: BaseTokenData;
  token1: BaseTokenData;
  pair?: SwapIDL.PairInfoExt;
}

export interface AddLiquidityMemo {
  fee0: string;
  fee1: string;
  price0: string;
  price1: string;
  liquidityAmount?: string;
  shareOfPool?: string;
}

export const useAddLiquidityMemo = ({
  token0,
  token1,
  pair,
}: AddLiquidityMemoParams) =>
  useMemo<AddLiquidityMemo>(() => {
    try {
      if (token0.metadata && token1.metadata && token0.value && token1.value) {
        const fee0 = toBigNumber(token0.metadata.fee)
          .multipliedBy(2)
          .applyDecimals(token0.metadata.decimals)
          .toString();

        const fee1 = toBigNumber(token1.metadata.fee)
          .multipliedBy(2)
          .applyDecimals(token1.metadata.decimals)
          .toString();

        if (pair && Number(pair.reserve0) && Number(pair.reserve1)) {
          // If pair exists and have reserves
          const price0 = Liquidity.getOppositeAmount({
            amountIn: '1',
            reserveIn: pair.reserve1,
            reserveOut: pair.reserve0,
            decimalsIn: token1.metadata.decimals,
            decimalsOut: token0.metadata.decimals,
          }).toString();

          const price1 = Liquidity.getOppositeAmount({
            amountIn: '1',
            reserveIn: pair.reserve0,
            reserveOut: pair.reserve1,
            decimalsIn: token0.metadata.decimals,
            decimalsOut: token1.metadata.decimals,
          }).toString();

          const options = {
            amount0: token0.value,
            amount1: token1.value,
            decimals0: token0.metadata?.decimals,
            decimals1: token1.metadata?.decimals,
            reserve0: pair.reserve0,
            reserve1: pair.reserve1,
            totalSupply: pair.totalSupply,
          };

          const liquidityAmount = Liquidity.getPosition(options)
            .applyDecimals(Liquidity.PAIR_DECIMALS)
            .toString();

          const shareOfPool = getShareOfPoolString(options);

          return {
            fee0,
            fee1,
            price0,
            price1,
            liquidityAmount,
            shareOfPool,
          };
        } else {
          // If pair doesn't exist or doesn't have reserves
          const price0 = toBigNumber(token0.value)
            .div(token1.value)
            .dp(token0.metadata.decimals)
            .toString();

          const price1 = toBigNumber(token1.value)
            .div(token0.value)
            .dp(token1.metadata.decimals)
            .toString();

          const liquidityAmount = Liquidity.getPosition({
            amount0: token0.value,
            amount1: token1.value,
            decimals0: token0.metadata.decimals,
            decimals1: token1.metadata.decimals,
            reserve0: 0,
            reserve1: 0,
            totalSupply: 0,
          })
            .applyDecimals(Liquidity.PAIR_DECIMALS)
            .toString();

          return {
            fee0,
            fee1,
            price0,
            price1,
            shareOfPool: '100%',
            liquidityAmount,
          };
        }
      }

      throw new Error('Empty token data');
    } catch {
      // If token data is empty or invalid values
      return {
        fee0: '0',
        fee1: '0',
        price0: '0',
        price1: '0',
      };
    }
  }, [token0, token1, pair]);

export interface TokenSourceMemoParams {
  token: BaseTokenData;
  tokenBalances?: Balances;
  sonicBalances?: Balances;
}

export const useTokenSourceMemo = ({
  token,
  tokenBalances,
  sonicBalances,
}: TokenSourceMemoParams) =>
  useMemo<AppAssetSource[] | undefined>(() => {
    if (token.metadata) {
      return getAppAssetsSources({
        balances: {
          plug: tokenBalances ? tokenBalances[token.metadata.id] : 0,
          sonic: sonicBalances ? sonicBalances[token.metadata.id] : 0,
        },
      });
    }
  }, [token.metadata, tokenBalances, sonicBalances]);
