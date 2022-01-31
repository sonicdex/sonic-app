import { useEffect, useState } from 'react';

import { modalsSliceActions, useAppDispatch } from '@/store';

import { useBatchHook, useMintWICPTransactionMemo } from '..';
import { useMintXTCTransactionMemo } from '../transactions/mint-xtc';

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
    console.log(blockHeights);
    const blockHeightsWICP = blockHeights.WICP;
    const blockHeightsXTC = blockHeights.XTC;

    let transactions: Record<string, any> = {};

    blockHeightsWICP?.forEach((blockHeight: string, index) => {
      transactions = {
        ...transactions,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        [`WICP-${index}`]: useMintWICPTransactionMemo({
          blockHeight: BigInt(blockHeight),
        }),
      };
    });

    blockHeightsXTC?.forEach((blockHeight: string, index) => {
      transactions = {
        ...transactions,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        [`XTC-${index}`]: useMintXTCTransactionMemo({
          blockHeight: BigInt(blockHeight),
        }),
      };
    });

    setTransactions(transactions);
  }, [blockHeights]);

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
