import { useMemo } from 'react';

import { ENV } from '@/config';
import { XTCIDL } from '@/did';

import { CreateTransaction, MintXTC } from '../../models';

export const useMintXTCTransactionMemo: CreateTransaction<MintXTC> = (
  options = {},
  onSuccess,
  onFail
) =>
  useMemo(() => {
    const { blockHeight, subaccount = [] } = options;
    return {
      canisterId: ENV.canistersPrincipalIDs.XTC,
      idl: XTCIDL.factory,
      methodName: 'mint_by_icp',
      onSuccess: async (res: XTCIDL.TxReceipt) => {
        if ('Err' in res) throw new Error(JSON.stringify(Object.keys(res.Err)));
        if (onSuccess) onSuccess(res);
      },
      onFail,
      args: (prevResponses: any[]) => {
        const argBlockHeight = prevResponses[0]?.response;

        return [subaccount, blockHeight ?? argBlockHeight];
      },
    };
  }, [onFail, onSuccess, options]);
