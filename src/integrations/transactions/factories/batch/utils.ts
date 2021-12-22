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

type GetKeysDepositTransactionsOptions = {
  approveTx: any;
  depositTx: any;
  txNames?: [string, string];
};

export const getDepositTransactions = ({
  approveTx,
  depositTx,
  txNames = ['approve', 'deposit'],
}: GetKeysDepositTransactionsOptions) => {
  const neededBalance = Number(depositTx.args[1]);

  if (neededBalance > 0) {
    return {
      [txNames[0]]: approveTx,
      [txNames[1]]: depositTx,
    };
  }
  return {};
};
