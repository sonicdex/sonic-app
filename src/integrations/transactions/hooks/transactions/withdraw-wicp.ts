import { useMemo } from 'react';

import { ENV } from '@/config';
import { ICP_METADATA } from '@/constants';
import { TokenIDL } from '@/did';
import { parseAmount } from '@/utils/format';

import { CreateTransaction, WithdrawWICP } from '../../models';

export const useWithdrawWICPTransactionMemo: CreateTransaction<WithdrawWICP> = (
  { amount, toAccountId },
  onSuccess,
  onFail
) =>
  useMemo(() => {
    if (!amount) throw new Error('Amount is required');
    if (!toAccountId) throw new Error('Account ID is required');

    return {
      canisterId: ENV.canistersPrincipalIDs.WICP,
      idl: TokenIDL.factory,
      methodName: 'withdraw',
      onSuccess: async (res: TokenIDL.Result) => {
        if ('Err' in res) throw new Error(JSON.stringify(Object.keys(res.Err)));
        if (onSuccess) onSuccess(res);
      },
      onFail,
      args: [parseAmount(amount, ICP_METADATA.decimals), toAccountId],
    };
  }, [amount, onFail, onSuccess, toAccountId]);
