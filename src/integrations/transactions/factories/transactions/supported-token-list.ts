// @ts-nocheck TODO: Fix types
import { ENV } from '@/config';
import { SwapIDL } from '@/did';
import { Transaction } from '@psychedelic/plug-inpage-provider/dist/src/Provider';
import { CreateTransaction } from '../../models';

export const createSupportedTokenListTransaction: CreateTransaction<
  null,
  Transaction
> = (args, onSuccess, onFail) => {
  return {
    canisterId: ENV.canisterIds.swap,
    idl: SwapIDL.factory,
    methodName: 'getSupportedTokenList',
    onSuccess,
    onFail,
    args: [],
  };
};
