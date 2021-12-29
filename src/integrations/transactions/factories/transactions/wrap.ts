import { useMemo } from 'react';

import { ENV } from '@/config';
import { WICPIDL } from '@/did';

import { CreateTransaction, Wrap } from '../../models';

export const useWrapTransactionMemo: CreateTransaction<Wrap> = (
  { blockHeight, subaccount = 0 },
  onSuccess,
  onFail
) =>
  useMemo(() => {
    if (!blockHeight) throw new Error('Block height is required');

    return {
      canisterId: ENV.canisterIds.WICP,
      idl: WICPIDL.factory,
      methodName: 'mint',
      onSuccess: async (res: WICPIDL.TxReceipt) => {
        if ('Err' in res) throw new Error(JSON.stringify(Object.keys(res.Err)));
        if (onSuccess) onSuccess(res);
      },
      onFail,
      args: [subaccount, blockHeight],
    };
  }, [blockHeight, subaccount]);
