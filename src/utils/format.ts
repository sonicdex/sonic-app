import BigNumber from 'bignumber.js';

import { parseUnits, formatUnits } from 'ethers/lib/utils';
import { Bytes } from '@ethersproject/bytes';
import { ethers } from 'ethers';
import { TokenMetadata } from '@/models';

export type BigNumberish = BigNumber | Bytes | bigint | string | number;

export const deserialize = (json: string) =>
  JSON.parse(json, (key, value) => {
    if (typeof value === 'string' && /^\d+n$/.test(value)) {
      return BigInt(value.substr(0, value.length - 1));
    }
    return value;
  });

export const stringify = (data: any) => {
  return JSON.stringify(data, (key, value) =>
    typeof value === 'bigint' ? value.toString() + 'n' : value
  );
};

export const parseAmount = (val: string, decimals: string | number): bigint => {
  try {
    const fixedVal = new BigNumber(val).toFixed(Number(decimals)); // Fix for scientific notation string
    const str = parseUnits(fixedVal, decimals).toString();
    return BigInt(str);
  } catch (err) {
    return BigInt(0);
  }
};

export const getCurrency = (
  amount: BigInt | undefined | string | number,
  decimals: BigInt | undefined | number
) => {
  if (!amount || typeof decimals === 'undefined') return 0;
  const num = new BigNumber(amount.toString()).div(
    new BigNumber(10).pow(decimals.toString())
  );
  return num;
};

export const getCurrencyString = (
  amount: BigInt | undefined | string | number,
  decimals: BigInt | undefined | number,
  toFixed: number | undefined = undefined
) => {
  const num = getCurrency(amount, decimals);

  if (num === 0) return '0';
  return typeof toFixed === 'undefined' ? num.toString() : num.toFixed(toFixed);
};

interface GetAmountLPOptions {
  token0Amount: string;
  token1Amount: string;
  reserve0: string;
  reserve1: string;
  totalSupply: string;
}

export const getAmountLP = ({
  token0Amount,
  token1Amount,
  reserve0,
  reserve1,
  totalSupply,
}: GetAmountLPOptions) => {
  const one = new BigNumber(token0Amount)
    .times(new BigNumber(totalSupply))
    .div(new BigNumber(reserve0))
    .toFixed(3);
  const two = new BigNumber(token1Amount)
    .times(new BigNumber(totalSupply))
    .div(new BigNumber(reserve1))
    .toFixed(3);
  return Math.min(Number(one), Number(two)).toFixed(3);
};

interface GetLPPercentageString extends GetAmountLPOptions {
  token0Decimals: number | bigint;
  token1Decimals: number | bigint;
}

export const getLPPercentageString = ({
  token0Amount,
  token0Decimals,
  token1Amount,
  token1Decimals,
  reserve0,
  reserve1,
  totalSupply,
}: GetLPPercentageString) => {
  const amountLp = getAmountLP({
    token0Amount: new BigNumber(token0Amount.toString())
      .multipliedBy(new BigNumber(10).pow(token0Decimals.toString()))
      .toString(),
    token1Amount: new BigNumber(token1Amount.toString())
      .multipliedBy(new BigNumber(10).pow(token1Decimals.toString()))
      .toString(),
    reserve0,
    reserve1,
    totalSupply,
  });

  const result = new BigNumber(amountLp)
    .dividedBy(new BigNumber(amountLp).plus(new BigNumber(totalSupply)))
    .multipliedBy(100);

  if (result.isEqualTo(0)) return '0%';

  if (result.isLessThanOrEqualTo(0.01)) {
    return '<0.01%';
  }

  return `${result.toFixed(2)}%`;
};

type GetEqualLPTokenAmount = {
  amountIn: string;
  reserveIn: string;
  reserveOut: string;
  decimalsOut: number;
};

export const getAmountEqualLPToken = ({
  amountIn,
  reserveIn,
  reserveOut,
  decimalsOut,
}: GetEqualLPTokenAmount) => {
  if (
    !amountIn ||
    new BigNumber(amountIn).isNaN() ||
    new BigNumber(reserveIn).isZero() ||
    new BigNumber(reserveOut).isZero()
  ) {
    return '0.00';
  }

  const amountOut = new BigNumber(amountIn)
    .multipliedBy(new BigNumber(reserveIn))
    .dividedBy(new BigNumber(reserveOut))
    .dp(decimalsOut)
    .toString();

  return amountOut;
};

export const getAmountOut = (
  amountIn: string | number,
  decimalsIn: string | number,
  decimalsOut: string | number,
  reserveIn: string | number,
  reserveOut: string | number,
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

export const getAmountMin = (
  value: number | string,
  tolerance: number | string,
  decimals: number | string
) => {
  return new BigNumber('1')
    .minus(new BigNumber(tolerance))
    .multipliedBy(new BigNumber(value))
    .dp(Number(decimals))
    .toString();
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

type FormatDefaultLiquidityTokenOptions = {
  fromToken: TokenMetadata;
  toToken: TokenMetadata;
  token0: TokenMetadata;
  token1: TokenMetadata;
};

export const formatDefaultLiquidityToken = ({
  fromToken,
  toToken,
  token0,
  token1,
}: FormatDefaultLiquidityTokenOptions) => {
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

export const formatAmount = (
  val: BigInt | number | string,
  decimals: number
): string => {
  try {
    return formatUnits(ethers.BigNumber.from(val.toString()), decimals);
  } catch (err) {
    return '0';
  }
};
