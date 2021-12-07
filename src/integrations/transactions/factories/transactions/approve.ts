import { ENV } from '@/config';
import { TokenIDL } from '@/did';
import { Principal } from '@dfinity/principal';
import { CreateTransaction, Deposit } from '../../models';

export const createApproveTransaction: CreateTransaction<Deposit> = (
  { amount, tokenId },
  onSuccess,
  onFail
) => {
  return {
    canisterId: tokenId,
    idl: TokenIDL.factory,
    methodName: 'approve',
    onSuccess,
    onFail,
    args: [Principal.fromText(ENV.canisterIds.swap), amount],
  };
};
