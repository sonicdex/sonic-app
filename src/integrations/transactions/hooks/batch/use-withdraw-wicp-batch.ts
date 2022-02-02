import { useMemo } from 'react';

import { ENV } from '@/config';
import { ICP_METADATA } from '@/constants';
import {
  modalsSliceActions,
  useAppDispatch,
  useSwapCanisterStore,
  useSwapViewStore,
  WithdrawWICPModalDataStep,
} from '@/store';

import { useBatchHook } from '..';
import {
  useWithdrawTransactionMemo,
  useWithdrawWICPTransactionMemo,
} from '../transactions';
import { getAmountDependsOnBalance } from '.';

type UseWithdrawWICPBatchOptions = {
  amount: string;
  toAccountId?: string;
};

export const useWithdrawWICPBatch = ({
  amount,
  toAccountId,
}: UseWithdrawWICPBatchOptions) => {
  const { tokenList } = useSwapViewStore();
  const { tokenBalances } = useSwapCanisterStore();
  const dispatch = useAppDispatch();

  if (!tokenBalances) throw new Error('Sonic balance is required');
  if (!tokenList) throw new Error('Token list is required');

  const withdraw = useWithdrawTransactionMemo({
    token: tokenList[ENV.canistersPrincipalIDs.WICP],
    amount: getAmountDependsOnBalance(
      tokenBalances[ENV.canistersPrincipalIDs.WICP],
      ICP_METADATA.decimals,
      amount
    ),
  });

  const withdrawWICP = useWithdrawWICPTransactionMemo({
    toAccountId,
    amount,
  });

  const transactions = useMemo(() => {
    let _transactions = {};

    if (Number(withdraw.args[1]) > 0) {
      _transactions = {
        withdraw,
      };
    }

    _transactions = {
      ..._transactions,
      withdrawWICP,
    };

    return _transactions;
  }, [withdrawWICP, withdraw]);

  const openBatchModal = () => {
    dispatch(
      modalsSliceActions.setWithdrawWICPModalData({
        steps: Object.keys(transactions) as WithdrawWICPModalDataStep[],
      })
    );

    dispatch(modalsSliceActions.openWithdrawWICPProgressModal());
  };

  return {
    batch: useBatchHook({
      transactions,
      handleRetry: () => {
        dispatch(modalsSliceActions.closeWithdrawWICPProgressModal());
        dispatch(modalsSliceActions.openWithdrawWICPFailModal());

        return Promise.resolve(false);
      },
    }),
    openBatchModal,
  };
};
