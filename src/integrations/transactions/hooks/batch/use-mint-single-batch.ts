import { useMemo } from 'react';

import { MintTokenSymbol, usePlugStore, useWalletStore } from '@/store';

import { getMintWICPTransaction } from '..';
import { getMintXTCTransaction } from '../transactions/mint-xtc';

// import { removeBlockHeightFromStorage } from '.';

export type UseMintSingleBatchOptions = {
  tokenSymbol: MintTokenSymbol;
  blockHeight: string;
};

import { BatchTransact } from 'artemis-web3-adapter';
import { artemis } from '@/integrations/artemis';

BatchTransact; artemis; usePlugStore;

export const useMintSingleBatch: any = ({ tokenSymbol, blockHeight }: UseMintSingleBatchOptions) => {
  const { principalId } = useWalletStore();
  if (!principalId) { return false };

  var batchLoad: any = { state: "idle" };
  var MintBatchTx = { batch: batchLoad };

  const batchTx = useMemo(() => {
    var trx:any;
    if (tokenSymbol === MintTokenSymbol.WICP) {
      trx = getMintWICPTransaction({ blockHeight:  blockHeight })
    } else if (tokenSymbol === MintTokenSymbol.XTC) {
      trx = getMintXTCTransaction({ blockHeight: blockHeight })
    }
    return new BatchTransact({ mint : trx}, artemis);
  }, []);
  if(batchTx){
    batchLoad.batchExecute = batchTx;
  }

  return MintBatchTx;
    // const transactions = useMemo(() => {
    //   let transactions: Record<string, any> = {};
    //   if (!principalId) { return transactions; }

    //   const handler = tokenSymbol === MintTokenSymbol.XTC ? getMintXTCTransaction : getMintWICPTransaction;

    //   transactions = {
    //     ...transactions,
    //     [tokenSymbol]: handler({ blockHeight }, () =>
    //       removeBlockHeightFromStorage({
    //         blockHeight,
    //         tokenSymbol: tokenSymbol,
    //         principalId,
    //       })
    //     ),
    //   };

    //   return transactions;
    // }, [principalId, tokenSymbol, blockHeight]);

    // const getTransactionNames = () => Object.keys(transactions);

    // return {
    //   batch: useBatch<string>({ transactions }),
    //   getTransactionNames,
    // };
};
