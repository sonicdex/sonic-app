import { useMemo } from 'react';

import { MintTokenSymbol, usePlugStore } from '@/store';

import { getMintWICPTransaction, useBatch } from '..';
import { getMintXTCTransaction } from '../transactions/mint-xtc';
import { removeBlockHeightFromStorage } from '.';

export type UseMintSingleBatchOptions = {
  tokenSymbol: MintTokenSymbol;
  blockHeight: string;
};

export const useMintSingleBatch = ({
  tokenSymbol,
  blockHeight,
}: UseMintSingleBatchOptions) => {
  const { principalId } = usePlugStore();

  const transactions = useMemo(() => {
    let transactions: Record<string, any> = {};

    if (!principalId) {
      return transactions;
    }

    const handler =
      tokenSymbol === MintTokenSymbol.XTC
        ? getMintXTCTransaction
        : getMintWICPTransaction;

    transactions = {
      ...transactions,
      [tokenSymbol]: handler({ blockHeight }, () =>
        removeBlockHeightFromStorage({
          blockHeight,
          tokenSymbol: tokenSymbol,
          principalId,
        })
      ),
    };

    return transactions;
  }, [principalId, tokenSymbol, blockHeight]);

  const getTransactionNames = () => Object.keys(transactions);

  return {
    batch: useBatch<string>({ transactions }),
    getTransactionNames,
  };
};
