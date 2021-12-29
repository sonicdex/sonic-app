import { useMemo } from 'react';

import { ENV } from '@/config';
import { LedgerIDL } from '@/did';

import { CreateTransaction, LedgerTransfer } from '../../models';

export const useLedgerTransferTransactionMemo: CreateTransaction<LedgerTransfer> =
  ({ toAccountId, fee, amount, memo = 0 }, onSuccess, onFail) =>
    useMemo(() => {
      if (!toAccountId) throw new Error('Account ID is required');
      if (!amount) throw new Error('Amount is required');

      return {
        canisterId: ENV.canisterIds.ledger,
        idl: LedgerIDL.factory,
        methodName: 'send_dfx',
        onSuccess: async (res: Promise<LedgerIDL.BlockHeight>) => {
          if (onSuccess) onSuccess(res);
        },
        onFail,
        args: [
          {
            toAccountId,
            fee,
            amount: { e8s: amount },
            memo: { e8s: memo },
          },
        ],
      };
    }, [amount]);
