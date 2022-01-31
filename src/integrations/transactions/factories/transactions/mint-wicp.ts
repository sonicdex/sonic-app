import { useMemo } from 'react';

import { ENV } from '@/config';
import { TokenIDL } from '@/did';
import { useModalsStore } from '@/store';

import { CreateTransaction, MintWICP } from '../../models';

export const useMintWICPTransactionMemo: CreateTransaction<MintWICP> = (
  options = {},
  onSuccess,
  onFail
) => {
  const { mintWICPUncompleteBlockHeights: wrapUncompleteBlockHeights } =
    useModalsStore();
  const lastUncompleteBlockHeight = wrapUncompleteBlockHeights?.at(-1);

  return useMemo(() => {
    const { blockHeight, subaccount = [] } = options;
    return {
      canisterId: ENV.canistersPrincipalIDs.WICP,
      idl: TokenIDL.factory,
      methodName: 'mint',
      onSuccess: async (res: TokenIDL.Result) => {
        if ('Err' in res) throw new Error(JSON.stringify(Object.keys(res.Err)));
        if (onSuccess) onSuccess(res);
      },
      onFail: async (err: any, prevResponses: any[]) => {
        if (onFail) onFail(err, prevResponses);
      },
      args: (prevResponses: any[]) => {
        const argBlockHeight = prevResponses?.[0]?.response;

        return [
          subaccount,
          blockHeight ?? argBlockHeight ?? lastUncompleteBlockHeight,
          123,
        ];
      },
    };
  }, [onFail, onSuccess, options, lastUncompleteBlockHeight]);
};
