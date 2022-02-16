import { Liquidity } from '@psychedelic/sonic-js';

export const getShareOfPoolString = (params: Liquidity.GetShareOfPool) => {
  const percentage = Liquidity.getShareOfPool(params).multipliedBy(100);

  if (percentage.isEqualTo(0)) return '0%';

  if (percentage.isLessThanOrEqualTo(0.01)) {
    return '<0.01%';
  }

  return `${percentage.toFixed(2)}%`;
};
