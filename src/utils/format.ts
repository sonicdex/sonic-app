import { Bytes } from '@ethersproject/bytes';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

import { ICP_METADATA } from '@/constants';
import { AppTokenMetadata } from '@/models';

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
    .div(new BigNumber(reserve0));

  const two = new BigNumber(token1Amount)
    .times(new BigNumber(totalSupply))
    .div(new BigNumber(reserve1));

  return Math.min(Number(one), Number(two)).toString();
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

export type GetAmountOutOptions = {
  amountIn: string | number;
  decimalsIn: string | number;
  decimalsOut: string | number;
  reserveIn: string | number;
  reserveOut: string | number;
  fee?: number;
};

export const getAmountOut = ({
  amountIn,
  decimalsIn,
  decimalsOut,
  reserveIn,
  reserveOut,
  fee = 3,
}: GetAmountOutOptions): string => {
  if (!amountIn || new BigNumber(amountIn).isZero()) return '';

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
  if (!amountOut || new BigNumber(amountOut).isZero()) return '';
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

export type CalculatePriceImpactOptions = {
  amountIn: string | number;
  decimalsIn: string | number;
  decimalsOut: string | number;
  reserveIn: string | number;
  reserveOut: string | number;
};

export const calculatePriceImpact = ({
  amountIn,
  decimalsIn,
  decimalsOut,
  reserveIn,
  reserveOut,
}: CalculatePriceImpactOptions): string => {
  if (
    !amountIn ||
    new BigNumber(amountIn).isNaN() ||
    new BigNumber(reserveOut).isZero()
  )
    return '0';

  // price impact = abs(reserve0/reserve1 - (reserve0 + amountIn) / (reserve1 - amountOut))

  const amountOut = getAmountOut({
    amountIn,
    decimalsIn,
    decimalsOut,
    reserveIn,
    reserveOut,
  });

  const aIn = new BigNumber(amountIn).multipliedBy(
    new BigNumber(10).pow(Number(decimalsIn))
  );
  const aOut = new BigNumber(Number(amountOut)).multipliedBy(
    new BigNumber(10).pow(Number(decimalsOut))
  );

  const a = new BigNumber(reserveIn).dividedBy(new BigNumber(reserveOut));
  const b = new BigNumber(reserveIn).plus(aIn);
  const c = new BigNumber(reserveOut).plus(aOut);
  const impact = a.minus(b.dividedBy(c)).abs().multipliedBy(100).toFixed(2);
  return impact;
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
  value: number | string,
  tolerance: number | string,
  decimals: number | string,
  tokenFees: {
    fee: number | string | bigint;
    decimals: number | string | bigint;
  }[]
) => {
  const withoutFees = new BigNumber('1')
    .minus(new BigNumber(tolerance))
    .multipliedBy(new BigNumber(value))
    .dp(Number(decimals));

  const withFees = tokenFees.reduce((acc, { fee, decimals }) => {
    return acc.minus(
      new BigNumber(Number(fee)).dividedBy(
        new BigNumber(10).pow(Number(decimals))
      )
    );
  }, withoutFees);

  return withFees;
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
