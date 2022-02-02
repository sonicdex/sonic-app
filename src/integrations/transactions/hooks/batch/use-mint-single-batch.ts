import { useMemo } from 'react';

import { MintTokenSymbol } from '@/store';

import { getMintWICPTransaction, useBatchHook } from '..';
import { getMintXTCTransaction } from '../transactions/mint-xtc';
import { removeWICPBlockHeight, removeXTCBlockHeight } from '.';

export type UseMintSingleBatchOptions = {
  tokenSymbol: MintTokenSymbol;
  blockHeight: string;
};

export const useMintSingleBatch = ({
  tokenSymbol,
  blockHeight,
}: UseMintSingleBatchOptions) => {
  const transactions = useMemo(() => {
    let transactions: Record<string, any> = {};

    if (tokenSymbol === MintTokenSymbol.WICP) {
      transactions = {
        ...transactions,
        ['WICP']: getMintWICPTransaction({ blockHeight }, () =>
          removeWICPBlockHeight(blockHeight)
        ),
      };
    }

    if (tokenSymbol === MintTokenSymbol.XTC) {
      transactions = {
        ...transactions,
        ['XTC']: getMintXTCTransaction({ blockHeight }, () =>
          removeXTCBlockHeight(blockHeight)
        ),
      };
    }

    return transactions;
  }, [blockHeight, tokenSymbol]);

  const getTransactionNames = () => Object.keys(transactions);

  return {
    batch: useBatchHook<string>({ transactions }),
    getTransactionNames,
  };
};
