import BigNumber from 'bignumber.js';

import RosettaApi from '@/apis/rosetta';
import { ENV } from '@/config';

export interface LedgerTransaction {
  account1Address: string;
  account2Address: string;
  amount: BigNumber;
  blockIndex: number;
  fee: BigNumber;
  hash: string;
  memo: BigNumber;
  status: string;
  timestamp: Date;
  type: string;
}

const ADDRESS_TO_FILTER = [ENV.accountIDs.XTC, ENV.accountIDs.WICP];

export const getUserLedgerTransactions = async (
  accountId: string
): Promise<LedgerTransaction[]> => {
  const rosetta = new RosettaApi();
  const ledgerTransactions = await rosetta.getTransactionsByAccount(accountId);

  if (Array.isArray(ledgerTransactions)) {
    return ledgerTransactions
      .filter(
        (t) =>
          ADDRESS_TO_FILTER.includes(t.account1Address) ||
          ADDRESS_TO_FILTER.includes(t.account2Address)
      )
      .reverse();
  } else {
    throw new Error('Failed to get ledger transactions');
  }
};
