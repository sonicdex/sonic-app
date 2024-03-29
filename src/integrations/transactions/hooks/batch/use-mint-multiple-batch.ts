import { useEffect, useState } from 'react';

import { MintTokenSymbol, useWalletStore } from '@/store';

import { getMintWICPTransaction, getMintXTCTransaction, useBatch } from '..';
import { getTransactionName, removeBlockHeightFromStorage } from '.';

export type UseMintMultipleBatchOptions = {
  blockHeights: {
    [MintTokenSymbol.XTC]?: string[];
    [MintTokenSymbol.WICP]?: string[];
  };
};

export const useMintMultipleBatch = ({
  blockHeights,
}: UseMintMultipleBatchOptions) => {
  const { principalId } = useWalletStore();
  const [transactions, setTransactions] = useState<Record<string, any>>({});

  useEffect(() => {
    let transactions: Record<string, any> = {};
    const updateTransactions = (
      tokenSymbol: MintTokenSymbol,
      blockHeight: string
    ) => {
      const handler =
        tokenSymbol === MintTokenSymbol.XTC
          ? getMintXTCTransaction
          : getMintWICPTransaction;

      const transactionName = getTransactionName({ tokenSymbol, blockHeight });
      const transaction = handler({ blockHeight }, () =>
        removeBlockHeightFromStorage({ blockHeight, tokenSymbol, principalId })
      );

      transactions = {
        ...transactions,
        [transactionName]: transaction,
      };
    };

    blockHeights.WICP?.forEach((blockHeight: string) => {
      updateTransactions(MintTokenSymbol.WICP, blockHeight);
    });

    blockHeights.XTC?.forEach((blockHeight: string) => {
      updateTransactions(MintTokenSymbol.XTC, blockHeight);
    });

    setTransactions(transactions);
  }, [blockHeights.WICP, blockHeights.XTC, principalId]);

  const getTransactionNames = () => Object.keys(transactions);

  return {
    batch: useBatch<string>({ transactions }),
    getTransactionNames,
  };
};
