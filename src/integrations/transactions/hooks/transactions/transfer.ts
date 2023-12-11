import { useMemo } from 'react';

import { TokenIDL } from '@/did';
import { parseAmount } from '@/utils/format';
import { getAccountIdFromPrincipalId, fromHexString, getPrincipalFromText } from "@/utils"

import { CreateTransaction, Transfer } from '../../models';

export const useTransferTransactionMemo: CreateTransaction<Transfer> = ({ amount, token, address, addressType }, onSuccess, onFail) =>
  useMemo(() => {
    if (!token?.id || !address || !amount) { return; }
    const tokenType = token.tokenType?.toLowerCase();
    const parsedAmount = amount ? parseAmount(amount, token.decimals) : BigInt(0);

    if (token?.symbol == 'ICP') {
      var natAddress = addressType == 'accountId' ? fromHexString(address) : fromHexString(getAccountIdFromPrincipalId(address));
      return {
        canisterId: token.id,
        idl: TokenIDL.ICRC1.factory,
        methodName: 'transfer',
        args: [{ to: natAddress, amount: { e8s: parsedAmount }, fee: { e8s: token.fee }, memo: 0, from_subaccount: [], created_at_time: [] }],
        onSuccess: onSuccess,
        onFail,
      }
    } else if (tokenType == 'dip20') {
      if (addressType != 'principalId') return false;
      return {
        canisterId: token.id,
        idl: TokenIDL.DIP20.factory,
        methodName: 'transfer',
        args: [getPrincipalFromText(address), parsedAmount],
        onSuccess: onSuccess,
        onFail,
      }
    } else if (tokenType == 'yc') {
      if (addressType != 'principalId') return false;
      return {
        canisterId: token.id,
        idl: TokenIDL.DIP20.YCfactory,
        methodName: 'transfer',
        args: [getPrincipalFromText(address), parsedAmount],
        onSuccess: onSuccess,
        onFail,
      }
    }
    else if (tokenType == 'icrc1' || tokenType == 'icrc2') {
      return {
        canisterId: token.id,
        idl: TokenIDL.ICRC1.factory,
        methodName: 'icrc1_transfer',
        onSuccess: onSuccess, onFail,
        args: [{
          to: { owner: getPrincipalFromText(address), subaccount: [] },
          fee: [], memo: [], amount: parsedAmount, from_subaccount: [], created_at_time: []
        }],
      };
    }
    else return false;
  }, [amount, token]);
