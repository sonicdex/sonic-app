import { ENV } from '@/config';
import { SwapIDL } from '@/did';
import { Principal } from '@dfinity/principal';
import { CreateTransaction, Deposit } from '../../models';

export const createDepositTransaction: CreateTransaction<Deposit> = (
  { amount, tokenId },
  onSuccess,
  onFail
) => {
  return {
    canisterId: ENV.canisterIds.swap,
    idl: SwapIDL.factory,
    methodName: 'deposit',
    onSuccess,
    onFail,
    args: [Principal.fromText(tokenId), amount],
  };
};
