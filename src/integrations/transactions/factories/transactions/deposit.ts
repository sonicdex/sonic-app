import { ENV } from '@/config';
import { SwapIDL } from '@/did';
import { parseAmount } from '@/utils/format';
import { Principal } from '@dfinity/principal';
import { useMemo } from 'react';
import { CreateTransaction, Deposit } from '../../models';

export const createDepositTransaction: CreateTransaction<Deposit> = (
  { amount, token },
  onSuccess,
  onFail
) =>
  useMemo(
    () => ({
      canisterId: ENV.canisterIds.swap,
      idl: SwapIDL.factory,
      methodName: 'deposit',
      onSuccess,
      onFail,
      args: [Principal.fromText(token.id), parseAmount(amount, token.decimals)],
    }),
    [amount, token]
  );
