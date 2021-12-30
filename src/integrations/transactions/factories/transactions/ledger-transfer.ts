import { useMemo } from 'react';

import { ENV } from '@/config';
import { LedgerIDL } from '@/did';

import { CreateTransaction, LedgerTransfer } from '../../models';
import { parseAmount } from '@/utils/format';
import { ICP_TOKEN_METADATA } from '@/constants';

export const useLedgerTransferTransactionMemo: CreateTransaction<LedgerTransfer> =
  (
    { toAccountId, fee = BigInt(10000), amount, memo = BigInt(0) },
    onSuccess,
    onFail
  ) =>
    useMemo(() => {
      if (!toAccountId) throw new Error('Account ID is required');
      if (!amount) throw new Error('Amount is required');

      return {
        canisterId: ENV.canisterIds.ledger,
        idl: LedgerIDL.factory,
        methodName: 'send_dfx',
        onSuccess: async (blockHeight: any) => {
          if (onSuccess) onSuccess(blockHeight);
          return blockHeight;
        },
        onFail,
        args: [
          {
            to: toAccountId,
            fee: { e8s: fee },
            amount: { e8s: parseAmount(amount, ICP_TOKEN_METADATA.decimals) },
            memo,
            from_subaccount: [], // For now, using default subaccount to handle ICP
            created_at_time: [],
          },
        ],
      };
    }, [amount]);
