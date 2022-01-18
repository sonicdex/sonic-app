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
    if (!token?.id) throw new Error('Token is required');

    const parsedAmount = parseAmount(amount, token.decimals);
    const toApproveAmount =
      parsedAmount + token.fee > BigInt(allowance) ? parsedAmount : 0;

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
        Principal.fromText(ENV.canistersPrincipalIDs.swap),
        toApproveAmount,
      ],
    };
  }, [amount, token, allowance]);
