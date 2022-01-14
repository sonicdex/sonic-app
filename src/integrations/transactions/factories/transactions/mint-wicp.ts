import { useMemo } from 'react';

import { ENV } from '@/config';
import { TokenIDL } from '@/did';

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
      idl: TokenIDL.factory,
      methodName: 'mint',
      onSuccess: async (res: TokenIDL.Result) => {
        if ('Err' in res) throw new Error(JSON.stringify(Object.keys(res.Err)));
        if (onSuccess) onSuccess(res);
      },
      onFail: async (err: any, prevTransactionsData: any[]) => {
        if (onFail) onFail(err, prevTransactionsData);
      },
      args: (prevResponses: any[]) => {
        const argBlockHeight = prevResponses[0]?.response;

        return [subaccount, blockHeight ?? argBlockHeight];
      },
    };
  }, [onFail, onSuccess, options]);
