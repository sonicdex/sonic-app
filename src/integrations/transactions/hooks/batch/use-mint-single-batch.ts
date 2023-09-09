import { useMemo } from 'react';

import { MintTokenSymbol,  useWalletStore } from '@/store';

import { getMintWICPTransaction } from '..';
import { getMintXTCTransaction } from '../transactions/mint-xtc';

export type UseMintSingleBatchOptions = {
  tokenSymbol: MintTokenSymbol;
  blockHeight: string;
};

import { BatchTransact } from 'artemis-web3-adapter';
import { artemis } from '@/integrations/artemis';


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
};
