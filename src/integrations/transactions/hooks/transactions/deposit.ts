import { Principal } from '@dfinity/principal';
import { useMemo } from 'react';

import { ENV } from '@/config';
import { SwapIDL } from '@/did';
import { parseAmount } from '@/utils/format';

import { CreateTransaction, Deposit } from '../../models';

export const useDepositTransactionMemo: CreateTransaction<Deposit> = ({ amount, token }, onSuccess, onFail) =>
  useMemo(() => {
    if (!token?.id || !amount) { return {} }
    if(amount) if(parseFloat(amount) <= 0) return;
    return {
      canisterId: ENV.canistersPrincipalIDs.swap,
      idl: SwapIDL.factory,
      methodName: 'deposit',
      onSuccess: async (res: SwapIDL.Result) => {
        if ('err' in res) throw new Error(res.err);
        if (onSuccess) onSuccess(res);
      },
      onFail,
      args: [ Principal.fromText(token?.id),parseAmount(amount, token?.decimals)],
    };
  }, [amount, token]);
