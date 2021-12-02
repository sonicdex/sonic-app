// @ts-nocheck TODO: fix types
import { ENV } from '@/config';
import { SwapIDL } from '@/did';
import type { Transaction } from '@psychedelic/plug-inpage-provider/dist/src/Provider';
import { CreateTransaction, Withdraw } from '../../models';

export interface WithdrawTransaction
  extends Transaction<SwapIDL.TxReceipt, SwapIDL.TxReceipt> {}

export const createWithdrawTransaction: CreateTransaction<
  Withdraw | null,
  WithdrawTransaction
> = ({ amount, tokenId }, onSuccess, onFail) => {
  return {
    args: [tokenId, amount],
    canisterId: ENV.canisterIds.swap,
    idl: SwapIDL.factory,
    methodName: 'withdraw',
    onSuccess,
    onFail,
  };
};
