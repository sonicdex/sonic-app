import { modalsSliceActions, useAppDispatch, WithdrawModalDataStep } from '@/store';
import { useMemo } from 'react';
import { Withdraw } from '../..';
import { useWithdrawTransactionMemo } from '..';

import { BatchTransact } from 'artemis-web3-adapter';
import { artemis } from '@/integrations/artemis';

export const useWithdrawBatch = (withdraw: Withdraw) => {
  const dispatch = useAppDispatch();
  var batchLoad: any = { state: "idle" };

  const openBatchModal = () => {
    dispatch(
      modalsSliceActions.setWithdrawModalData({ steps: ['withdraw'] as WithdrawModalDataStep[], tokenSymbol: withdraw.token?.symbol,})
    );
    dispatch(modalsSliceActions.openWithdrawProgressModal());
  };
  const withdrawMemo = useWithdrawTransactionMemo(withdraw);
  
  const  WithdrawBatchTx = useMemo(() => {
    return new BatchTransact({ withdraw: withdrawMemo }, artemis);
  }, [withdrawMemo]);

  if (WithdrawBatchTx) { batchLoad.batchExecute = WithdrawBatchTx;}

  return {batch: batchLoad, openBatchModal };
};
