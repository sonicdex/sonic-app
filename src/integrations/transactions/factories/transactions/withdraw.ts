import { ENV } from '@/config';
import { SwapIDL } from '@/did';
import { Transaction } from '@psychedelic/plug-inpage-provider/dist/src/Provider';
import { CreateTransaction, Deposit, Withdraw } from '../../models';

export interface WithdrawTransaction
  extends Transaction<SwapIDL.TxReceipt, SwapIDL.TxReceipt> {}

export const createWithdrawTransaction: CreateTransaction<
  Withdraw,
  WithdrawTransaction
> = ({ amount, principal }, onSuccess, onFail) => {
  return {
    args: [principal, amount],
    canisterId: ENV.canisterIds.swap,
    idl: SwapIDL.factory,
    methodName: 'withdraw',
    onSuccess,
    onFail,
  };
};
