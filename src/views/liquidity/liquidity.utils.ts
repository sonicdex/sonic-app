import { Liquidity, toBigNumber } from '@psychedelic/sonic-js';
import { BigNumber } from 'bignumber.js';

export interface GetOppositeLPValue {
  amountIn: string;
  reserveIn: string;
  reserveOut: string;
  decimalsOut: number;
  decimalsIn: number;
}

export const getOppositeLPValue = ({
  amountIn,
  reserveIn,
  reserveOut,
  decimalsOut,
  decimalsIn,
}: GetOppositeLPValue) => {
  if (
    !amountIn ||
    new BigNumber(amountIn).isNaN() ||
    new BigNumber(reserveIn).isZero() ||
    new BigNumber(reserveOut).isZero()
  ) {
    return '0';
  }

  return new BigNumber(amountIn)
    .multipliedBy(
      new BigNumber(reserveOut).dividedBy(new BigNumber(10).pow(decimalsOut))
    )
    .dividedBy(
      new BigNumber(reserveIn).dividedBy(new BigNumber(10).pow(decimalsIn))
    )
    .dp(decimalsOut);
};

export interface GetUserLPValue {
  price0: string;
  price1: string;
  reserve0: bigint;
  reserve1: bigint;
  decimals0: number;
  decimals1: number;
  totalShares: string;
  userShares: string;
}

export const getUserLPValue = ({
  price0,
  price1,
  reserve0,
  reserve1,
  decimals0,
  decimals1,
  totalShares,
  userShares,
}: GetUserLPValue) => {
  const token0Price = new BigNumber(price0).multipliedBy(
    toBigNumber(reserve0).applyDecimals(decimals0)
  );
  const token1Price = new BigNumber(price1).multipliedBy(
    toBigNumber(reserve1).applyDecimals(decimals1)
  );
  const priceByLP = token0Price.plus(token1Price).dividedBy(totalShares);

  const decimals = Liquidity.getPairDecimals(decimals0, decimals1);

  return new BigNumber(userShares).multipliedBy(priceByLP).dp(decimals);
};

export const getShareOfPoolString = (params: Liquidity.GetShareOfPool) => {
  const percentage = Liquidity.getShareOfPool(params).multipliedBy(100);

  if (percentage.isEqualTo(0)) return '0%';

  if (percentage.isLessThanOrEqualTo(0.01)) {
    return '<0.01%';
  }

  return `${percentage.toFixed(2)}%`;
};
