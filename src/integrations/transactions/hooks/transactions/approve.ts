import { Principal } from '@dfinity/principal';
import { useMemo } from 'react';

import { ENV } from '@/config';
import { TokenIDL } from '@/did';
import { parseAmount } from '@/utils/format';

import { CreateTransaction, Deposit } from '../../models';

export const useApproveTransactionMemo: CreateTransaction<Deposit> = (
  { amount, token, allowance = 0 },
  onSuccess,
  onFail
) =>
  useMemo(() => {
    if (!token?.id) {
      return;
    }

    const parsedAmount = amount
      ? parseAmount(amount, token.decimals)
      : BigInt(0);
    const toApproveAmount =
      parsedAmount + token.fee > BigInt(allowance) ? parsedAmount : 0;

    var batchTransaction  = {
      canisterId: token.id,
      idl: TokenIDL.factory,
      methodName: 'approve',
      onSuccess: async (res: TokenIDL.Result) => {
        if ('Err' in res) throw new Error(JSON.stringify(res.Err));
        if (onSuccess) onSuccess(res);
      },
      onFail,
      args: [
        Principal.fromText(ENV.canistersPrincipalIDs.swap),
        toApproveAmount,
      ],
    };
    
    if (token.symbol == 'YC'){
      return {
        canisterId: token.id,
        idl: TokenIDL.YCfactory,
        methodName: 'approve',
        onSuccess: async (res: TokenIDL.YCResult) => {
          if ('Err' in res) throw new Error(JSON.stringify(res.Err));
          if (onSuccess) onSuccess(res);
        },
        onFail,
        args: [
          Principal.fromText(ENV.canistersPrincipalIDs.swap),
          toApproveAmount,
        ],  
      };
    }

    return batchTransaction;
  }, [amount, token, allowance]);
