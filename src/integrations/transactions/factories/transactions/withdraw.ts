import { ENV } from '@/config';
import { SwapIDL } from '@/did';
import { parseAmount } from '@/utils/format';
import { Principal } from '@dfinity/principal';
import { CreateTransaction, Withdraw } from '../../models';

export const createWithdrawTransaction: CreateTransaction<Withdraw> = (
  { amount, token },
  onSuccess,
  onFail
) => {
  return {
    args: [Principal.fromText(token.id), parseAmount(amount, token.decimals)],
    canisterId: ENV.canisterIds.swap,
    idl: SwapIDL.factory,
    methodName: 'withdraw',
    onSuccess,
    onFail,
  };
};
