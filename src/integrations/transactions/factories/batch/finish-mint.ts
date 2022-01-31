import { useEffect, useState } from 'react';

import { modalsSliceActions, useAppDispatch } from '@/store';

import { getMintWICPTransaction, useBatchHook } from '..';
import { getMintXTCTransaction } from '../transactions/mint-xtc';

export type UseFinishMintBatchOptions = {
  blockHeights: {
    XTC?: string[];
    WICP?: string[];
  };
};

export const useFinishMintBatch = ({
  blockHeights,
}: UseFinishMintBatchOptions) => {
  const [transactions, setTransactions] = useState<Record<string, any>>({});
  const dispatch = useAppDispatch();

  useEffect(() => {
    let transactions: Record<string, any> = {};

    blockHeights.WICP?.forEach((blockHeight: string, index) => {
      transactions = {
        ...transactions,
        [`WICP-${index}`]: getMintWICPTransaction({
          blockHeight: BigInt(blockHeight),
        }),
      };
    });

    blockHeights.XTC?.forEach((blockHeight: string, index) => {
      transactions = {
        ...transactions,
        [`XTC-${index}`]: getMintXTCTransaction({
          blockHeight: BigInt(blockHeight),
        }),
      };
    });

    setTransactions(transactions);
  }, [blockHeights.WICP, blockHeights.XTC]);

  const startMinting = () => {
    dispatch(
      modalsSliceActions.startFinishMinting({
        steps: Object.keys(transactions),
      })
    );
  };

  return {
    batch: useBatchHook<string>({ transactions }),
    startMinting,
  };
};
