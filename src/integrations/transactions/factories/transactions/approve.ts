import { ENV } from '@/config';
import { TokenIDL } from '@/did';
import { parseAmount } from '@/utils/format';
import { Principal } from '@dfinity/principal';
import { useMemo } from 'react';
import { CreateTransaction, Deposit } from '../../models';

export const useApproveTransactionMemo: CreateTransaction<Deposit> = (
  { amount, token },
  onSuccess,
  onFail
) =>
  useMemo(() => {
    if (!token?.id) throw new Error('Token is required');

    return {
      canisterId: token.id,
      idl: TokenIDL.factory,
      methodName: 'approve',
      onSuccess: async (res: TokenIDL.Result) => {
        if ('Err' in res) throw new Error(JSON.stringify(res.Err));
        if (onSuccess) onSuccess(res);
      },
      onFail,
      args: [
        Principal.fromText(ENV.canisterIds.swap),
        parseAmount(amount, token.decimals),
      ],
    };
  }, [amount, token]);
