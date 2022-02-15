import { Bytes } from '@ethersproject/bytes';
import { toBigNumber } from '@psychedelic/sonic-js';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

import { ICP_METADATA } from '@/constants';
import { AppTokenMetadata } from '@/models';

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

export const getAmountMultipliedByDecimals = (
  amount: bigint | undefined | string | number,
  decimals: bigint | undefined | number
) => {
  const _amount = new BigNumber(String(amount));
  const _decimals = new BigNumber(String(decimals));

  if (
    _amount.isZero() ||
    _amount.isNaN() ||
    _decimals.isZero() ||
    _decimals.isNaN()
  )
    return new BigNumber(0);

  return _amount.multipliedBy(new BigNumber(10).pow(_decimals));
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

export type GetValueWithoutFeesOptions = {
  value: string;
  fee: bigint;
  decimals: number;
  numberOfFees?: number;
};

export const getValueWithoutFees = ({
  value,
  fee,
  decimals,
  numberOfFees = 1,
}: GetValueWithoutFeesOptions) => {
  const _value = new BigNumber(value);
  const _feesAmount = toBigNumber(numberOfFees * Number(fee)).applyDecimals(
    decimals
  );

  return _value.minus(_feesAmount);
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
    return toBigNumber(value).applyDecimals(token.decimals).toString();
  }

  return '';
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
