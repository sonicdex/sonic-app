import { useMemo } from 'react';

import { ENV } from '@/config';
import { WICPIDL } from '@/did';

import { CreateTransaction, Unwrap } from '../../models';

export const useUnwrapTransactionMemo: CreateTransaction<Unwrap> = (
  { value, toAccountId },
  onSuccess,
  onFail
) =>
  useMemo(() => {
    if (!value) throw new Error('Value is required');
    if (!toAccountId) throw new Error('Account ID is required');

    return {
      canisterId: ENV.canisterIds.WICP,
      idl: WICPIDL.factory,
      methodName: 'withdraw',
      onSuccess: async (res: WICPIDL.TxReceipt) => {
        if ('Err' in res) throw new Error(JSON.stringify(Object.keys(res.Err)));
        if (onSuccess) onSuccess(res);
      },
      onFail,
      args: [value, toAccountId],
    };
  }, [value, toAccountId]);
