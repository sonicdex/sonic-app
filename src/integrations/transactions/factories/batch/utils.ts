import { getCurrency } from '@/utils/format';

export const getAmountDependsOnBalance = (
  tokenBalance: number,
  tokenDecimals: number,
  fromValue: string
): string => {
  const parsedFromValue = parseFloat(fromValue);
  const parsedTokenBalance = Number(getCurrency(tokenBalance, tokenDecimals));
  return (parsedFromValue - parsedTokenBalance).toString();
};

type GetDepositTransactionsOptions = {
  approveTx: any;
  depositTx: any;
  txNames?: [string, string];
};

export const getDepositTransactions = ({
  approveTx,
  depositTx,
  txNames = ['approve', 'deposit'],
}: GetDepositTransactionsOptions) => {
  const requiredAllowance = Number(approveTx.args[1]);
  const requiredBalance = Number(depositTx.args[1]);

  let transactions = {};

  if (requiredBalance > 0) {
    if (requiredAllowance > 0) {
      transactions = {
        ...transactions,
        [txNames[0]]: approveTx,
      };
    }
    transactions = {
      ...transactions,
      [txNames[1]]: depositTx,
    };
  }

  return transactions;
};
