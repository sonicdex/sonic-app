import { Principal } from '@dfinity/principal';
import { Transaction } from '@psychedelic/plug-inpage-provider/dist/src/Provider';
import { useMemo } from 'react';

import { ENV } from '@/config';
import { SwapIDL } from '@/did';

import { CreatePair,CreateTransaction } from '../../models';

export type CreatePairTransaction = Transaction

export interface CreatePairExtraArgs {
  principal: Principal;
}

export const useCreatePairTransactionMemo: CreateTransaction<CreatePair> = (
  { token0, token1 }: CreatePair,
  onSuccess,
  onFail
) =>
  useMemo(() => {
    if (!token0.metadata || !token1.metadata)
      throw new Error('Tokens are required');

    return {
      canisterId: ENV.canisterIds.swap,
      idl: SwapIDL.factory,
      methodName: 'createPair',
      onFail: async (res: SwapIDL.Result) => {
        console.error(res);
        if ('err' in res) throw new Error(res.err);
        if (onFail) onFail(res);
      },
      onSuccess: async (res: SwapIDL.Result) => {
        if ('err' in res) throw new Error(res.err);
        if (onSuccess) onSuccess(res);
      },
      args: [
        Principal.fromText(token0.metadata.id),
        Principal.fromText(token1.metadata.id),
      ],
    };
  }, [token0, token1]);
