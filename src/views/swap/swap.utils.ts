import { Pair, Swap } from '@psychedelic/sonic-js';
import BigNumber from 'bignumber.js';

import {
  DEFAULT_CYCLES_PER_XDR,
  SwapTokenData,
  TOKEN_SUBDIVIDABLE_BY,
} from '@/store';
import { getValueWithoutFees } from '@/utils/format';

export type GetXTCValueByXDRRateOptions = {
  amount: string;
  conversionRate: string;
};

export type GetICPValueByXDRRateOptions = {
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

export const getAmountOutFromPath = (
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

export type GetSwapAmountOutMinOptions = {
  from: SwapTokenData;
  to: SwapTokenData;
  slippage: string;
  allPairs?: Pair.List;
  hasDeposit?: boolean;
  hasWithdraw?: boolean;
};

export const getSwapAmountOutMin = ({
  from,
  to,
  slippage,
  allPairs,
  hasDeposit,
  hasWithdraw,
}: GetSwapAmountOutMinOptions) => {
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
    fromValue = getValueWithoutFees({
      value: from.value,
      fee: from.metadata.fee,
      decimals: from.metadata.decimals,
      numberOfFees: 2,
    });
  }

  const toValue = Swap.getAmountOut({
    amountIn: fromValue.toString(),
    decimalsIn: from.metadata.decimals,
    decimalsOut: to.metadata.decimals,
    reserveIn: Number(pair.reserve0),
    reserveOut: Number(pair.reserve1),
  }).toString();

  let result = Swap.getAmountMin({
    amount: toValue,
    slippage,
    decimals: to.metadata.decimals,
  });

  if (hasWithdraw) {
    result = getValueWithoutFees({
      value: result.toString(),
      fee: to.metadata.fee,
      decimals: to.metadata.decimals,
      numberOfFees: 2,
    });
  }

  return result.dp(Number(to.metadata.decimals)).toString();
};
