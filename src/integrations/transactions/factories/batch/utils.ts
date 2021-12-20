import { TokenData } from '@/models';
import { getCurrency, parseAmount } from '@/utils/format';

export const getToDepositAmount = (
  tokenBalance: number,
  tokenDecimals: number,
  fromValue: string
): string => {
  const parsedFromValue = parseFloat(fromValue);
  const parsedTokenBalance = Number(getCurrency(tokenBalance, tokenDecimals));
  return (parsedFromValue - parsedTokenBalance).toString();
};

type GetKeysDepositTransactionsOptions = {
  approveTx: any;
  depositTx: any;
  txNames?: [string, string];
  token: TokenData;
};

export const getDepositTransactions = ({
  approveTx,
  depositTx,
  txNames = ['approve', 'deposit'],
  token,
}: GetKeysDepositTransactionsOptions) => {
  const neededBalance = Number(
    // TODO: remove this hack
    parseAmount(token.value, token.metadata!.decimals)
  );

  if (neededBalance > 0) {
    return {
      [txNames[0]]: approveTx,
      [txNames[1]]: depositTx,
    };
  }
  return {};
};
