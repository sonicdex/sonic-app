import { useMemo } from 'react';

import { ENV } from '@/config';
import { WICPIDL } from '@/did';

import { CreateTransaction, MintWICP } from '../../models';

export const useMintWICPTransactionMemo: CreateTransaction<MintWICP> = (
  options = {},
  onSuccess,
  onFail
) =>
  useMemo(() => {
    const { blockHeight, subaccount = [] } = options;
    return {
      canisterId: ENV.canisterIds.WICP,
      idl: WICPIDL.factory,
      methodName: 'mint',
      onSuccess: async (res: WICPIDL.TxReceipt) => {
        if ('Err' in res) throw new Error(JSON.stringify(Object.keys(res.Err)));
        if (onSuccess) onSuccess(res);
      },
      onFail: async (err: any, prevTransactionsData: any[]) => {
        if (onFail) onFail(prevTransactionsData);
      },
      args: (prevResponses: any[]) => {
        const argBlockHeight = prevResponses[0]?.response;

        return [subaccount, blockHeight ?? argBlockHeight];
      },
    };
  }, [options]);
