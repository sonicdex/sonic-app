import { ENV } from '@/config';
import { ICP_TOKEN_METADATA } from '@/constants';
import {
  modalsSliceActions,
  UnwrapModalDataStep,
  useAppDispatch,
  useSwapCanisterStore,
  useSwapViewStore,
} from '@/store';
import { useMemo } from 'react';
import { getAmountDependsOnBalance } from '.';

import { useBatchHook } from '..';
import { Batch } from '../..';
import {
  useWithdrawWICPTransactionMemo,
  useWithdrawTransactionMemo,
} from '../transactions';

type Unwrap = {
  amount: string;
  toAccountId?: string;
};

export const useUnwrapBatch = ({ amount, toAccountId }: Unwrap) => {
  const { tokenList } = useSwapViewStore();
  const { tokenBalances } = useSwapCanisterStore();
  const dispatch = useAppDispatch();

  if (!tokenBalances) throw new Error('Sonic balance is required');
  if (!tokenList) throw new Error('Token list is required');

  const withdraw = useWithdrawTransactionMemo({
    token: tokenList[ENV.canisterIds.WICP],
    amount: getAmountDependsOnBalance(
      tokenBalances[ENV.canisterIds.WICP],
      ICP_TOKEN_METADATA.decimals,
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
  }, [withdrawWICP]);

  const handleOpenBatchModal = () => {
    dispatch(
      modalsSliceActions.setUnwrapModalData({
        steps: Object.keys(transactions) as UnwrapModalDataStep[],
      })
    );

    dispatch(modalsSliceActions.openUnwrapProgressModal());
  };

  return [
    useBatchHook({
      transactions,
      handleRetry: () => {
        dispatch(modalsSliceActions.closeUnwrapProgressModal());
        return Promise.resolve(false);
      },
    }),
    handleOpenBatchModal,
  ] as [Batch.Hook<UnwrapModalDataStep>, () => void];
};
