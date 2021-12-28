import { ENV } from '@/config';
import { SwapIDL } from '@/did';
import { parseAmount } from '@/utils/format';
import { Principal } from '@dfinity/principal';
import { useMemo } from 'react';
import { CreateTransaction, Deposit } from '../../models';

export const useMemorizedDepositTransaction: CreateTransaction<Deposit> = (
  { amount, token },
  onSuccess,
  onFail
) =>
  useMemo(() => {
    if (!token?.id) throw new Error('Token is required');

    return {
      canisterId: ENV.canisterIds.swap,
      idl: SwapIDL.factory,
      methodName: 'deposit',
      onSuccess: async (res: SwapIDL.Result) => {
        if ('err' in res) throw new Error(res.err);
        if (onSuccess) onSuccess(res);
      },
      onFail,
      args: [
        Principal.fromText(token?.id),
        parseAmount(amount, token?.decimals),
      ],
    };
  }, [amount, token]);
