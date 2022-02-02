import { getFromStorage, LocalStorageKey, saveToStorage } from '@/config';
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

export const removeWICPBlockHeight = (blockHeight: string) => {
  const WICPBlockHeights = getFromStorage(
    LocalStorageKey.MintWICPUncompleteBlockHeights
  );

  if (WICPBlockHeights && WICPBlockHeights.length > 0) {
    const newWICPBlockHeights = WICPBlockHeights.filter(
      (_blockHeight: string) => _blockHeight !== blockHeight
    );

    saveToStorage(
      LocalStorageKey.MintWICPUncompleteBlockHeights,
      newWICPBlockHeights
    );
  }
};

export const removeXTCBlockHeight = (blockHeight: string) => {
  const XTCBlockHeights = getFromStorage(
    LocalStorageKey.MintXTCUncompleteBlockHeights
  );

  if (XTCBlockHeights && XTCBlockHeights.length > 0) {
    const newXTCBlockHeights = XTCBlockHeights.filter(
      (_blockHeight: string) => _blockHeight !== blockHeight
    );

    saveToStorage(
      LocalStorageKey.MintXTCUncompleteBlockHeights,
      newXTCBlockHeights
    );
  }
};
