import { useEffect, useState } from 'react';

import { getMintWICPTransaction, useBatchHook } from '..';
import { getMintXTCTransaction } from '../transactions/mint-xtc';
import { removeWICPBlockHeight, removeXTCBlockHeight } from '.';

export type UseMintMultipleBatchOptions = {
  blockHeights: {
    XTC?: string[];
    WICP?: string[];
  };
};

export const useMintMultipleBatch = ({
  blockHeights,
}: UseMintMultipleBatchOptions) => {
  const [transactions, setTransactions] = useState<Record<string, any>>({});

  useEffect(() => {
    let transactions: Record<string, any> = {};

    blockHeights.WICP?.forEach((blockHeight: string) => {
      transactions = {
        ...transactions,
        [`WICP-${blockHeight}`]: getMintWICPTransaction({ blockHeight }, () =>
          removeWICPBlockHeight(blockHeight)
        ),
      };
    });

    blockHeights.XTC?.forEach((blockHeight: string) => {
      transactions = {
        ...transactions,
        [`XTC-${blockHeight}`]: getMintXTCTransaction({ blockHeight }, () =>
          removeXTCBlockHeight(blockHeight)
        ),
      };
    });

    setTransactions(transactions);
  }, [blockHeights.WICP, blockHeights.XTC]);

  const getTransactionNames = () => Object.keys(transactions);

  return {
    batch: useBatchHook<string>({ transactions }),
    getTransactionNames,
  };
};
