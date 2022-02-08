import { Bytes } from '@ethersproject/bytes';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

import { ICP_METADATA } from '@/constants';
import { AppTokenMetadata, PairList } from '@/models';
import { SwapTokenData, SwapTokenDataKey } from '@/store';
import {
  DEFAULT_CYCLES_PER_XDR,
  TOKEN_SUBDIVIDABLE_BY,
} from '@/store/features/cycles-minting-canister/cycles-minting-canister.constants';

export type BigNumberish = BigNumber | Bytes | bigint | string | number;

BigNumber.config({ EXPONENTIAL_AT: 99 });

export const deserialize = (json: string) => {
  try {
    return JSON.parse(json, (key, value) => {
      if (typeof value === 'string' && /^\d+n$/.test(value)) {
        return BigInt(value.substr(0, value.length - 1));
      }
      return value;
    });
  } catch {
    return undefined;
  }
};

export const stringify = (data: any) => {
  try {
    return JSON.stringify(data, (key, value) =>
      typeof value === 'bigint' ? value.toString() + 'n' : value
    );
  } catch {
    return '';
  }
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

export type GetAmountOptions = {
  amountIn: string | number;
  decimalsIn: string | number;
  decimalsOut: string | number;
  reserveIn: string | number;
  reserveOut: string | number;
  fee?: number;
  dataKey: SwapTokenDataKey;
};

export const getAmount = ({
  amountIn,
  decimalsIn,
  decimalsOut,
  reserveIn,
  reserveOut,
  fee = 3,
  dataKey = 'from',
}: GetAmountOptions): string => {
  if (!amountIn || new BigNumber(amountIn).isZero()) return '';

  const thousand = new BigNumber('1000');
  const _amountIn = new BigNumber(amountIn);
  const _decimalsIn = new BigNumber(10).pow(decimalsIn);
  const _decimalsOut = new BigNumber(10).pow(decimalsOut);
  const _reserveIn = new BigNumber(reserveIn).multipliedBy(thousand);

  const _fee = dataKey === 'from' ? thousand.minus(fee) : thousand.plus(fee);

  const _amountInWithFee = _amountIn
    .multipliedBy(_decimalsIn)
    .multipliedBy(_fee);

  const _numerator = _amountInWithFee.multipliedBy(new BigNumber(reserveOut));

  const _denominator = _reserveIn.plus(_amountInWithFee);

  return _numerator
    .dividedBy(_denominator)
    .dividedBy(_decimalsOut)
    .toFixed(Number(decimalsOut));
};

export const getAmountMin = (
  value: number | string,
  tolerance: number | string, // Percentage
  decimals: number | string
) => {
  return new BigNumber('1')
    .minus(new BigNumber(tolerance).dividedBy(100))
    .multipliedBy(new BigNumber(value))
    .dp(Number(decimals))
    .toString();
};

export type CalculatePriceImpactOptions = {
  priceIn?: string | number;
  priceOut?: string | number;
  amountIn?: string | number;
  amountOut?: string | number;
};

export const calculatePriceImpact = ({
  amountIn,
  amountOut,
  priceIn,
  priceOut,
}: CalculatePriceImpactOptions): string => {
  if (
    !amountIn ||
    new BigNumber(amountIn).isZero() ||
    new BigNumber(amountIn).isNaN() ||
    !amountOut ||
    new BigNumber(amountOut).isZero() ||
    new BigNumber(amountOut).isNaN() ||
    !priceIn ||
    new BigNumber(priceIn).isZero() ||
    new BigNumber(priceIn).isNaN() ||
    !priceOut ||
    new BigNumber(priceOut).isZero() ||
    new BigNumber(priceOut).isNaN()
  )
    return '0';

  const _priceOut = new BigNumber(
    calculatePriceBasedOnAmount({
      amount: amountOut,
      price: priceOut,
    })
  );
  const _priceIn = new BigNumber(
    calculatePriceBasedOnAmount({
      amount: amountIn,
      price: priceIn,
    })
  );

  const priceImpact = new BigNumber(1)
    .minus(new BigNumber(_priceOut).dividedBy(_priceIn))
    .multipliedBy(100)
    .negated();

  // Price impact formulas:
  // ((1 - (priceOut/priceIn)) * 100) * -1

  return priceImpact.toString();
};

export type CalculatePriceBasedOnAmountOptions = {
  amount?: string | number;
  price?: string | number;
};

export const calculatePriceBasedOnAmount = ({
  amount,
  price,
}: CalculatePriceBasedOnAmountOptions) => {
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

const fixStringEnding = (str: string) => {
  return str.replace(/0+$/, '').replace(/\.$/, '');
};

export const formatValue = (value: string): string => {
  const [nat = '0', decimals = '0'] = value.replace(/^0+/, '').split('.');

  if (Math.sign(Number(value)) === -1) {
    return fixStringEnding(`${nat || 0}.${decimals.slice(0, 2)}`);
  }

  const thousands = Math.floor(Math.log10(Number(nat)));

  if (thousands < 3) {
    if (!nat && /^00/.test(decimals)) {
      return `< 0.01`;
    }
    return fixStringEnding(`${nat || 0}.${decimals.slice(0, 2)}`);
  } else if (thousands < 6) {
    return fixStringEnding(`${nat.slice(0, -3)}.${nat.slice(-3, -1)}`) + 'k';
  } else if (thousands < 9) {
    return fixStringEnding(`${nat.slice(0, -6)}.${nat.slice(-6, -4)}`) + 'M';
  } else {
    return `> 999M`;
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

  const toValue = getAmount({
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

export const getDepositMaxValue = (
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

export const getSwapAmountOut = (
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
