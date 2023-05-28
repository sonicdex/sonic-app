import { Principal } from '@dfinity/principal';
import { useMemo } from 'react';

import { ENV } from '@/config';
import { TokenIDL } from '@/did';
import { parseAmount } from '@/utils/format';

import { CreateTransaction, Deposit } from '../../models';

export const useApproveTransactionMemo: CreateTransaction<Deposit> = (
  { amount, token, allowance = 0 }, onSuccess, onFail
) =>
  useMemo(() => {
    if (!token?.id ) { return; }
    if(amount) if(parseFloat(amount) <= 0) return;
    
    const tokenType = token.tokenType;
    const parsedAmount = amount ? parseAmount(amount, token.decimals) : BigInt(0);
    const toApproveAmount = parsedAmount + token.fee > BigInt(allowance) ? parsedAmount : 0;

    if (tokenType == 'DIP20') {
      return {
        canisterId: token.id, idl: TokenIDL.DIP20.factory, methodName: 'approve',
        onSuccess: async (res: TokenIDL.DIP20.Result) => {
          if ('Err' in res) throw new Error(JSON.stringify(res.Err));
          if (onSuccess) onSuccess(res);
        },
        onFail,
        args: [Principal.fromText(ENV.canistersPrincipalIDs.swap), toApproveAmount],
      };
    }
    else if (tokenType == 'YC') {
      return {
        canisterId: token.id, idl: TokenIDL.DIP20.YCfactory, methodName: 'approve',
        onSuccess: async (res: TokenIDL.DIP20.YCResult) => {
          if ('Err' in res) throw new Error(JSON.stringify(res.Err));
          if (onSuccess) onSuccess(res);
        },
        onFail,
        args: [Principal.fromText(ENV.canistersPrincipalIDs.swap), toApproveAmount],
      };
    }
    else return false;
  }, [amount, token, allowance]);
