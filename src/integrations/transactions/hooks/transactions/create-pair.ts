import { Principal } from '@dfinity/principal';
import { useMemo } from 'react';

import { ENV } from '@/config';
import { SwapIDL } from '@/did';
import { AppLog } from '@/utils';

import { CreatePair, CreateTransaction } from '../../models';

export type CreatePairTransaction = {
  idl: any;
  canisterId: string;
  methodName: string;
  args: (responses?: any[]) => any[] | any[];
  onSuccess: (res: any) => Promise<any>;
  onFail: (err: any, responses?: any[]) => Promise<void>;
};

export const useCreatePairTransactionMemo: CreateTransaction<CreatePair> = (
   { token0, token1 }: CreatePair,onSuccess,onFail) =>useMemo(() => {
    if (!token0.metadata || !token1.metadata) {
      return {};
    }
    return {
      canisterId: ENV.canistersPrincipalIDs.swap,
      idl: SwapIDL.factory,
      methodName: 'createPair',
      onFail: async (res: SwapIDL.Result) => {
        AppLog.error('Create pair transaction failed', res);
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
  }, []);
