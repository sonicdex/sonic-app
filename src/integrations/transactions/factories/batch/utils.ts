import { getCurrency } from '@/utils/format';

export const getToDepositAmount = (
  tokenBalance: number,
  tokenDecimals: number,
  fromValue: string
): string => {
  const parsedFromValue = parseFloat(fromValue);
  const parsedTokenBalance = Number(getCurrency(tokenBalance, tokenDecimals));
  return (parsedFromValue - parsedTokenBalance).toString();
};
