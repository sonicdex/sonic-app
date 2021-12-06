import BigNumber from 'bignumber.js';

import { parseUnits, formatUnits } from 'ethers/lib/utils';
import { Bytes } from '@ethersproject/bytes';
import { ethers } from 'ethers';
import { SupportedToken } from '@/models';

export type BigNumberish = BigNumber | Bytes | bigint | string | number;

export const parseAmount = (val: string, decimals: number): bigint => {
  try {
    const str = parseUnits(val, decimals).toString();
    return BigInt(str);
  } catch (err) {
    return BigInt(0);
  }
};

export const getCurrencyString = (
  amount: BigInt | undefined | string | number,
  decimals: BigInt | undefined | number,
  toFixed: number | undefined = undefined
) => {
  if (!amount || typeof decimals === 'undefined') return '0';
  const num = new BigNumber(amount.toString()).div(
    new BigNumber(10).pow(decimals.toString())
  );
  return typeof toFixed === 'undefined' ? num.toString() : num.toFixed(toFixed);
};

export const getLpAmount = (
  fromTokenAmount: string,
  toTokenAmount: string,
  reserve0: string,
  reserve1: string,
  pairTotalSupply: string
) => {
  const one = new BigNumber(fromTokenAmount)
    .times(new BigNumber(pairTotalSupply))
    .div(new BigNumber(reserve0))
    .toFixed(3);
  const two = new BigNumber(toTokenAmount)
    .times(new BigNumber(pairTotalSupply))
    .div(new BigNumber(reserve1))
    .toFixed(3);
  return Math.min(Number(one), Number(two)).toFixed(3);
};

export const getAmountOut = (
  amountIn: string,
  decimalsIn: string,
  decimalsOut: string,
  reserveIn: string,
  reserveOut: string,
  fee = 3 // means 0.003
): string => {
  if (!amountIn || new BigNumber(amountIn).isZero()) return '0';
  const amountInWithFee = new BigNumber(amountIn) // amountIn * 997;
    .multipliedBy(new BigNumber(10).pow(decimalsIn))
    .multipliedBy(new BigNumber('1000').minus(fee));
  const numerator = amountInWithFee.multipliedBy(new BigNumber(reserveOut)); // amountInWithFee * reserveOut;
  const denominator = new BigNumber(reserveIn) // reserveIn * 1000 + amountInWithFee;
    .multipliedBy(new BigNumber('1000'))
    .plus(amountInWithFee);
  return numerator
    .dividedBy(denominator)
    .dividedBy(new BigNumber(10).pow(decimalsOut))
    .toFixed(Number(decimalsOut));
};

export const getAmountIn = (
  amountOut: string,
  decimalsIn: string,
  decimalsOut: string,
  reserveIn: string,
  reserveOut: string
): string => {
  if (!amountOut || new BigNumber(amountOut).isZero()) return '0';
  const numerator = new BigNumber(reserveIn) // reserveIn * amountOut * 1000;
    .multipliedBy(
      new BigNumber(amountOut).multipliedBy(new BigNumber(10).pow(decimalsOut))
    )
    .multipliedBy(new BigNumber('1000'));
  const denominator = new BigNumber(reserveOut) // (reserveOut - amountOut) * 997;
    .minus(
      new BigNumber(amountOut).multipliedBy(new BigNumber(10).pow(decimalsOut))
    )
    .multipliedBy(new BigNumber('997'));
  return numerator
    .dividedBy(denominator)
    .plus(new BigNumber('1'))
    .dividedBy(new BigNumber(10).pow(decimalsIn))
    .toFixed(Number(decimalsIn));
};

export const calculatePriceImpact = (
  amountIn: string,
  decimalsIn: string,
  amountOut: string,
  decimalsOut: string,
  reserve0: string,
  reserve1: string
): string => {
  if (
    !amountIn ||
    !amountOut ||
    new BigNumber(amountIn).isNaN() ||
    new BigNumber(amountOut).isNaN() ||
    new BigNumber(reserve1).isZero()
  )
    return '0.00';
  // price impact = abs(reserve0/reserve1 - (reserve0 + amountIn)/(reserve1 - amountOut))
  const aIn = new BigNumber(amountIn).multipliedBy(
    new BigNumber(10).pow(parseInt(decimalsIn))
  );
  const aOut = new BigNumber(amountOut).multipliedBy(
    new BigNumber(10).pow(parseInt(decimalsOut))
  );
  const a = new BigNumber(reserve0).dividedBy(new BigNumber(reserve1));
  const b = new BigNumber(reserve0).plus(aIn);
  const c = new BigNumber(reserve1).plus(aOut);
  const impact = a.minus(b.dividedBy(c)).abs().multipliedBy(100).toFixed(2);
  return impact;
};

type InitDefaultLiquidityTokenOptions = {
  fromToken: SupportedToken;
  toToken: SupportedToken;
  token0: SupportedToken;
  token1: SupportedToken;
};

export const initDefaultLiquidityToken = ({
  fromToken,
  toToken,
  token0,
  token1,
}: InitDefaultLiquidityTokenOptions) => {
  const defaultFromToken = fromToken
    ? {
        decimals: fromToken.decimals,
        fee: fromToken.fee,
        id: token0,
        name: fromToken.name,
        symbol: fromToken.symbol,
        totalSupply: fromToken.totalSupply,
        logo: fromToken.logo,
      }
    : '';
  const defaultToToken = toToken
    ? {
        decimals: toToken.decimals,
        fee: toToken.fee,
        id: token1,
        name: toToken.name,
        symbol: toToken.symbol,
        totalSupply: toToken.totalSupply,
        logo: toToken.logo,
      }
    : '';
  return {
    defaultFromToken,
    defaultToToken,
  };
};

export const formatAmount = (val: BigInt, decimals: number): string => {
  try {
    return formatUnits(ethers.BigNumber.from(val.toString()), decimals);
  } catch (err) {
    return '0';
  }
};

export const amountOutMin = (
  toValue: number,
  tolerance: number,
  decimals: string
) => {
  return new BigNumber('1')
    .minus(new BigNumber(tolerance))
    .multipliedBy(new BigNumber(toValue))
    .dp(Number(decimals))
    .toString();
};

export const amountInMax = (
  fromValue: number,
  tolerance: number,
  decimals: string
) => {
  return new BigNumber('1')
    .minus(new BigNumber(tolerance))
    .multipliedBy(new BigNumber(fromValue))
    .dp(Number(decimals))
    .toString();
};
