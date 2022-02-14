import { Bytes } from '@ethersproject/bytes';
import { Swap } from '@psychedelic/sonic-js';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

import { ICP_METADATA } from '@/constants';
import { AppTokenMetadata, PairList } from '@/models';
import { SwapTokenData } from '@/store';
import {
  DEFAULT_CYCLES_PER_XDR,
  TOKEN_SUBDIVIDABLE_BY,
} from '@/store/features/cycles-minting-canister/cycles-minting-canister.constants';

export type BigNumberish = BigNumber | Bytes | bigint | string | number;

BigNumber.config({ EXPONENTIAL_AT: 99 });

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
  amount?: BigInt | string | number,
  decimals?: BigInt | number,
  toFixed?: number
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
    .multipliedBy(100);

  const two = new BigNumber(token1Amount)
    .times(new BigNumber(totalSupply))
    .div(new BigNumber(reserve1))
    .multipliedBy(100);

  return Math.min(Number(one), Number(two)).toString();
};

export type GetXTCValueByXDRRateOptions = {
  amount: string;
  conversionRate: string;
};

export function getXTCValueByXDRRate({
  amount,
  conversionRate,
}: GetXTCValueByXDRRateOptions) {
  const _amount = new BigNumber(amount);
  const _conversionRate = new BigNumber(conversionRate);
  const _defaultCyclesPerXDR = new BigNumber(DEFAULT_CYCLES_PER_XDR);
  const _subdividableBy = new BigNumber(TOKEN_SUBDIVIDABLE_BY * 100_000_000);

  // XTCValueByXDRRate = amount * conversionRate * defaultCyclesPerXDR / subdividableBy
  const result = _amount
    .multipliedBy(_conversionRate)
    .multipliedBy(_defaultCyclesPerXDR)
    .dividedBy(_subdividableBy);

  return result;
}

export type GetICPValueByXDRRateOptions = {
  amount: string;
  conversionRate: string;
};

export function getICPValueByXDRRate({
  amount,
  conversionRate,
}: GetXTCValueByXDRRateOptions) {
  const _amount = new BigNumber(amount);
  const _defaultCyclesPerXDR = new BigNumber(DEFAULT_CYCLES_PER_XDR);
  const _subdividableBy = new BigNumber(TOKEN_SUBDIVIDABLE_BY * 100_000_000);

  const _conversionRate = new BigNumber(conversionRate);

  // ICPValueByXDRRate = amount / conversionRate / defaultCyclesPerXDR * subdividableBy
  const result = _amount
    .multipliedBy(_subdividableBy)
    .dividedBy(_defaultCyclesPerXDR)
    .dividedBy(_conversionRate);

  return result;
}

export interface GetLPPercentageString extends GetAmountLPOptions {
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

  const result = new BigNumber(amountLp).dividedBy(
    new BigNumber(amountLp).plus(new BigNumber(totalSupply))
  );

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
  decimalsIn: number;
};

export const getAmountEqualLPToken = ({
  amountIn,
  reserveIn,
  reserveOut,
  decimalsOut,
  decimalsIn,
}: GetEqualLPTokenAmount) => {
  if (
    !amountIn ||
    new BigNumber(amountIn).isNaN() ||
    new BigNumber(reserveIn).isZero() ||
    new BigNumber(reserveOut).isZero()
  ) {
    return '0';
  }

  const amountOut = new BigNumber(amountIn)
    .multipliedBy(
      new BigNumber(reserveOut).dividedBy(new BigNumber(10).pow(decimalsOut))
    )
    .dividedBy(
      new BigNumber(reserveIn).dividedBy(new BigNumber(10).pow(decimalsIn))
    )
    .dp(decimalsOut)
    .toString();

  return amountOut;
};

export type GetPriceBasedOnAmountOptions = {
  amount?: string | number;
  price?: string | number;
};

export const getPriceBasedOnAmount = ({
  amount,
  price,
}: GetPriceBasedOnAmountOptions) => {
  if (
    !amount ||
    new BigNumber(amount).isZero() ||
    new BigNumber(amount).isNaN() ||
    !price ||
    new BigNumber(price).isZero() ||
    new BigNumber(price).isNaN()
  ) {
    return '0';
  }

  return new BigNumber(price).multipliedBy(amount).toString();
};

export const formatValue = (
  val: BigInt | number | string,
  decimals: number
): string => {
  try {
    return formatUnits(ethers.BigNumber.from(val.toString()), decimals);
  } catch (err) {
    return '0';
  }
};

export const getAmountOutMin = (
  from: SwapTokenData,
  to: SwapTokenData,
  slippage: string,
  allPairs?: PairList,
  hasDeposit?: boolean,
  hasWithdraw?: boolean
) => {
  if (
    !from.metadata ||
    new BigNumber(from.value).isZero() ||
    new BigNumber(from.value).isNaN() ||
    !to.metadata ||
    new BigNumber(to.value).isZero() ||
    new BigNumber(to.value).isNaN() ||
    !allPairs
  )
    return '0';

  const pair = allPairs[from.metadata.id]?.[to.metadata.id];
  if (!pair) return '0';

  let fromValue = new BigNumber(from.value);

  if (hasDeposit) {
    fromValue = fromValue.minus(
      new BigNumber(2 * Number(from.metadata.fee)).dividedBy(
        new BigNumber(10).pow(from.metadata.decimals)
      )
    );
  }

  const toValue = Swap.getAmount({
    amountIn: fromValue.toString(),
    decimalsIn: from.metadata.decimals,
    decimalsOut: to.metadata.decimals,
    reserveIn: Number(pair.reserve0),
    reserveOut: Number(pair.reserve1),
    dataKey: 'from',
  });

  let result = new BigNumber(toValue).multipliedBy(
    new BigNumber('1').minus(new BigNumber(slippage).dividedBy(100))
  );

  if (hasWithdraw) {
    result = result.minus(
      new BigNumber(Number(to.metadata.fee)).dividedBy(
        new BigNumber(10).pow(to.metadata.decimals)
      )
    );
  }

  return result.dp(Number(to.metadata.decimals)).toString();
};

export const getMaxValue = (
  token?: AppTokenMetadata,
  balance?: number | bigint
) => {
  if (!token || !balance) return '';

  const times = token.id === ICP_METADATA.id ? 1 : 2;

  const value = new BigNumber(Number(balance))
    .minus(Number(token.fee) * times)
    .toNumber();

  if (value > 0) {
    return getCurrencyString(value, token.decimals);
  }

  return '';
};

export const getPathAmountOut = (
  tokenIn: SwapTokenData,
  tokenOut: SwapTokenData
): string => {
  if (!tokenIn.metadata || !tokenOut.metadata || !tokenIn.value) return '';

  const path = tokenIn.paths[tokenOut.metadata.id];

  if (path) {
    return new BigNumber(path.amountOut)
      .dp(tokenOut.metadata.decimals)
      .toString();
  }

  return '';
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
