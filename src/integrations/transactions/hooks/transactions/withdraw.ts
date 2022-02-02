import { Principal } from '@dfinity/principal';
import { useMemo } from 'react';

import { ENV } from '@/config';
import { SwapIDL } from '@/did';
import { parseAmount } from '@/utils/format';

import { CreateTransaction, Withdraw } from '../../models';

export const useWithdrawTransactionMemo: CreateTransaction<Withdraw> = (
  { amount, token },
  onSuccess,
  onFail
) =>
  useMemo(() => {
    if (!token?.id || !amount) {
      return;
    }

    return {
      args: [Principal.fromText(token.id), parseAmount(amount, token.decimals)],
      canisterId: ENV.canistersPrincipalIDs.swap,
      idl: SwapIDL.factory,
      methodName: 'withdraw',
      onSuccess: async (res: SwapIDL.Result) => {
        if ('err' in res) throw new Error(res.err);
        if (onSuccess) onSuccess(res);
      },
      onFail,
    };
  }, [amount, token, onFail, onSuccess]);
