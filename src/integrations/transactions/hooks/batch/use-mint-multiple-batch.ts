import { useEffect, useState } from 'react';

import { getFromStorage, LocalStorageKey, saveToStorage } from '@/config';
import { modalsSliceActions, useAppDispatch } from '@/store';

import { getMintWICPTransaction, useBatchHook } from '..';
import { getMintXTCTransaction } from '../transactions/mint-xtc';

export type UseMintMultipleBatchOptions = {
  blockHeights: {
    XTC?: string[];
    WICP?: string[];
  };
};

const removeWICPBlockHeight = (blockHeight: string) => {
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

const removeXTCBlockHeight = (blockHeight: string) => {
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

export const useMintMultipleBatch = ({
  blockHeights,
}: UseMintMultipleBatchOptions) => {
  const [transactions, setTransactions] = useState<Record<string, any>>({});

  const dispatch = useAppDispatch();

  useEffect(() => {
    let transactions: Record<string, any> = {};

    blockHeights.WICP?.forEach((blockHeight: string, index) => {
      transactions = {
        ...transactions,
        [`WICP-${index}`]: getMintWICPTransaction(
          { blockHeight },
          removeWICPBlockHeight(blockHeight)
        ),
      };
    });

    blockHeights.XTC?.forEach((blockHeight: string, index) => {
      transactions = {
        ...transactions,
        [`XTC-${index}`]: getMintXTCTransaction(
          { blockHeight },
          removeXTCBlockHeight(blockHeight)
        ),
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
