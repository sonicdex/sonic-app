import { useEffect, useState } from 'react';

import { MintTokenSymbol, usePlugStore } from '@/store';

import { getMintWICPTransaction, useBatchHook } from '..';
import { getMintXTCTransaction } from '../transactions/mint-xtc';
import { removeBlockHeight } from '.';

export type UseMintMultipleBatchOptions = {
  blockHeights: {
    XTC?: string[];
    WICP?: string[];
  };
};

export const useMintMultipleBatch = ({
  blockHeights,
}: UseMintMultipleBatchOptions) => {
  const { principalId } = usePlugStore();
  const [transactions, setTransactions] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!principalId) {
      return;
    }

    let transactions: Record<string, any> = {};

    blockHeights.WICP?.forEach((blockHeight: string) => {
      transactions = {
        ...transactions,
        [`WICP-${blockHeight}`]: getMintWICPTransaction({ blockHeight }, () =>
          removeBlockHeight({
            blockHeight,
            tokenSymbol: MintTokenSymbol.WICP,
            principalId,
          })
        ),
      };
    });

    blockHeights.XTC?.forEach((blockHeight: string) => {
      transactions = {
        ...transactions,
        [`XTC-${blockHeight}`]: getMintXTCTransaction({ blockHeight }, () =>
          removeBlockHeight({
            blockHeight,
            tokenSymbol: MintTokenSymbol.XTC,
            principalId,
          })
        ),
      };
    });

    setTransactions(transactions);
  }, [blockHeights.WICP, blockHeights.XTC, principalId]);

  const getTransactionNames = () => Object.keys(transactions);

  return {
    batch: useBatchHook<string>({ transactions }),
    getTransactionNames,
  };
};
