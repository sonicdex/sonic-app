import { ENV } from '@/config';
import { SwapIDL } from '@/did';
import { parseAmount } from '@/utils/format';
import { Principal } from '@dfinity/principal';
import { useMemo } from 'react';
import { CreateTransaction, Withdraw } from '../../models';

export const useMemorizedWithdrawTransaction: CreateTransaction<Withdraw> = (
  { amount, token },
  onSuccess,
  onFail
) =>
  useMemo(() => {
    if (!token?.id) throw new Error('Token is required');

    return {
      args: [Principal.fromText(token.id), parseAmount(amount, token.decimals)],
      canisterId: ENV.canisterIds.swap,
      idl: SwapIDL.factory,
      methodName: 'withdraw',
      onSuccess,
      onFail,
    };
  }, [amount, token]);
