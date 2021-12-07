import { ENV } from '@/config';
import { TokenIDL } from '@/did';
import { parseAmount } from '@/utils/format';
import { Principal } from '@dfinity/principal';
import { CreateTransaction, Deposit } from '../../models';

export const createApproveTransaction: CreateTransaction<Deposit> = (
  { amount, token },
  onSuccess,
  onFail
) => {
  return {
    canisterId: token.id,
    idl: TokenIDL.factory,
    methodName: 'approve',
    onSuccess,
    onFail,
    args: [
      Principal.fromText(ENV.canisterIds.swap),
      parseAmount(amount, token.decimals),
    ],
  };
};
