import { ENV } from '@/config';
import { SwapIDL } from '@/did';
import { Transaction } from '@psychedelic/plug-inpage-provider/dist/src/Provider';
import { CreateTransaction, Deposit } from '../../models';

export interface DepositTransaction extends Transaction {}

export const createDepositTransaction: CreateTransaction<
  Deposit,
  DepositTransaction
> = ({ amount, tokenId }, onSuccess, onFail) => {
  return {
    canisterId: ENV.canisterIds.swap,
    idl: SwapIDL.factory,
    methodName: 'deposit',
    onSuccess,
    onFail,
    args: [tokenId, amount],
  };
};
