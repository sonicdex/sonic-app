import { useMemo } from 'react';

import { DepositModalDataStep, modalsSliceActions, useAppDispatch } from '@/store';

import { Deposit } from '../..';
import { useApproveTransactionMemo, useDepositTransactionMemo, intitICRCTokenDeposit, useICRCTransferMemo } from '..'; //useICRCDepositMemo


import { BatchTransact } from 'artemis-web3-adapter';

import { artemis } from '@/integrations/artemis';

export const useDepositBatch = (deposit: Deposit): any => {
  const dispatch = useAppDispatch();
  var batchLoad: any = { state: "idle" };

  var DepositBatch = { batch: batchLoad, openBatchModal: () => { }, transactions: {} };
  var tokenType = deposit.token?.tokenType;

  if (tokenType == 'DIP20' || tokenType == 'YC') {

    var approveTx = useApproveTransactionMemo(deposit);
    var depositTx = useDepositTransactionMemo(deposit);

    const DepositBatchTx = useMemo(() => {
      return new BatchTransact({ approve: approveTx, deposit: depositTx }, artemis);
    }, [depositTx]);

    var openBatchModal = () => {
      dispatch(
       modalsSliceActions.setDepositModalData({
          steps: [ 'approve', 'deposit'] as DepositModalDataStep[],
          tokenSymbol: deposit.token?.symbol,
        })
      );
      dispatch(modalsSliceActions.openDepositProgressModal());
    };
    if (DepositBatchTx) { batchLoad.batchExecute = DepositBatchTx;}

    DepositBatch = { ...DepositBatch, batch: batchLoad, openBatchModal };
    return DepositBatch;

  } else if (tokenType == 'ICRC1') {
    var openBatchModal = () => {
      dispatch(modalsSliceActions.setDepositModalData(
        { steps: ['getacnt', 'approve', 'deposit'] as DepositModalDataStep[], tokenSymbol: deposit.token?.symbol})
      );
      dispatch(modalsSliceActions.openDepositProgressModal());
    };
    DepositBatch = { ...DepositBatch, openBatchModal };

    var getAcnt = intitICRCTokenDeposit();
    var approveTx = useICRCTransferMemo({ ...deposit });
    var depositTx = useDepositTransactionMemo(deposit);

    const DepositBatchTx = useMemo(() => {
      return new BatchTransact({getacnt:getAcnt, approve: approveTx,deposit: depositTx}, artemis);
    }, []);

    if (DepositBatchTx) {
      batchLoad.batchExecute = DepositBatchTx;
      DepositBatch = { ...DepositBatch, batch: batchLoad, openBatchModal };
    }
    DepositBatch = { ...DepositBatch, batch: batchLoad, openBatchModal };
    return DepositBatch;
  }
  else return DepositBatch
};
