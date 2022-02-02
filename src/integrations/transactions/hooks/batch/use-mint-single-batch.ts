import { useMemo } from 'react';

import { MintTokenSymbol, usePlugStore } from '@/store';

import { getMintWICPTransaction, useBatchHook } from '..';
import { getMintXTCTransaction } from '../transactions/mint-xtc';
import { removeBlockHeight } from '.';

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

    if (tokenSymbol === MintTokenSymbol.WICP) {
      transactions = {
        ...transactions,
        ['WICP']: getMintWICPTransaction({ blockHeight }, () =>
          removeBlockHeight({
            blockHeight,
            tokenSymbol: MintTokenSymbol.WICP,
            principalId,
          })
        ),
      };
    }

    if (tokenSymbol === MintTokenSymbol.XTC) {
      transactions = {
        ...transactions,
        ['XTC']: getMintXTCTransaction({ blockHeight }, () =>
          removeBlockHeight({
            blockHeight,
            tokenSymbol: MintTokenSymbol.XTC,
            principalId,
          })
        ),
      };
    }

    return transactions;
  }, [blockHeight, tokenSymbol, principalId]);

  const getTransactionNames = () => Object.keys(transactions);

  return {
    batch: useBatchHook<string>({ transactions }),
    getTransactionNames,
  };
};
