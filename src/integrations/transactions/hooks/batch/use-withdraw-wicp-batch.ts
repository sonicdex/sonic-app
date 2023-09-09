import { useMemo } from 'react';

import { ENV } from '@/config';
import { ICP_METADATA } from '@/constants';
import {
  modalsSliceActions, useAppDispatch, useSwapCanisterStore, useSwapViewStore, WithdrawWICPModalDataStep,
} from '@/store';

import {
  useWithdrawTransactionMemo, useWithdrawWICPTransactionMemo,
} from '../transactions';

import { getAmountDependsOnBalance } from '.';


import { BatchTransact } from 'artemis-web3-adapter';
import { artemis } from '@/integrations/artemis';

type UseWithdrawWICPBatchOptions = {
  amount: string;
  toAccountId?: string;
};

export const useWithdrawWICPBatch = ({ amount, toAccountId, }: UseWithdrawWICPBatchOptions) => {
  const { tokenList } = useSwapViewStore();
  const { tokenBalances } = useSwapCanisterStore();
  const dispatch = useAppDispatch();

  if (!tokenBalances) throw new Error('Sonic balance is required');
  if (!tokenList) throw new Error('Token list is required');

  var batchLoad: any = { state: "idle" };

  const withdraw = useWithdrawTransactionMemo({
    token: tokenList[ENV.canistersPrincipalIDs.WICP],
    amount: getAmountDependsOnBalance(
      tokenBalances[ENV.canistersPrincipalIDs.WICP], ICP_METADATA.decimals,amount
    ),
  });
  const withdrawWICP = useWithdrawWICPTransactionMemo({ toAccountId, amount });

  const WithdrawBatch = useMemo(() => {
    let _transactions = {};
    if (Number(withdraw.args[1]) > 0) { _transactions = { withdraw };}
    _transactions = { ..._transactions, withdrawWICP };
    return new BatchTransact(_transactions, artemis);
  }, [withdrawWICP, withdraw]);

  const openBatchModal = () => {
    dispatch(
      modalsSliceActions.setWithdrawWICPModalData({
        steps: Object.keys(WithdrawBatch.stepsList) as WithdrawWICPModalDataStep[],
      })
    );
    dispatch(modalsSliceActions.openWithdrawWICPProgressModal());
  };

  if (WithdrawBatch) { batchLoad.batchExecute = WithdrawBatch;}
  return {batch: batchLoad, openBatchModal };
};
