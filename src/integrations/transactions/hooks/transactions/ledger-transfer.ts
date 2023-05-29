import { useMemo } from 'react';

import { ENV } from '@/config';
import { ICP_METADATA } from '@/constants';
import { LedgerIDL } from '@/did';
import { parseAmount } from '@/utils/format';

import { CreateTransaction, LedgerTransfer } from '../../models';

export const useLedgerTransferTransactionMemo: CreateTransaction<LedgerTransfer> = (
  { toAccountId, fee = ICP_METADATA.fee, amount, memo = BigInt(0) }, onSuccess, onFail) =>
  useMemo(() => {
    if (!toAccountId || !amount) { return {}; }
    return {
      canisterId: ENV.canistersPrincipalIDs.ledger,
      idl: LedgerIDL.factory,
      methodName: 'send_dfx',
      onSuccess: async (blockHeight: number[]) => {
        if (onSuccess) onSuccess(blockHeight);
        return blockHeight;
      },
      onFail,
      args: [
        { to: toAccountId, fee: { e8s: fee },
          amount: { e8s: parseAmount(amount, ICP_METADATA.decimals)},
          memo,from_subaccount: [],created_at_time: [],
        },
      ],
    };
  }, [amount, fee, memo, onFail, onSuccess, toAccountId]);
