import { useMemo } from 'react';

import { DepositModalDataStep, modalsSliceActions, useAppDispatch } from '@/store';

import { Deposit } from '../..';
import { useApproveTransactionMemo, useDepositTransactionMemo, useBatch, intitICRCTokenDeposit, useICRCTransferMemo } from '..'; //useICRCDepositMemo

import { getDepositTransactions } from '.';

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

    var transactions = useMemo(
      () =>
        getDepositTransactions({ approveTx, depositTx, txNames: ['approve', 'deposit'], tokenType: deposit.token?.tokenType }),
      [approveTx, depositTx]
    );

    var openBatchModal = () => {
      dispatch(
        modalsSliceActions.setDepositModalData({
          steps: Object.keys(transactions) as DepositModalDataStep[],
          tokenSymbol: deposit.token?.symbol,
        })
      );
      dispatch(modalsSliceActions.openDepositProgressModal());
    };

    DepositBatch = {
      batch: useBatch<DepositModalDataStep>({
        transactions,
        handleRetry: () => {
          dispatch(modalsSliceActions.closeDepositProgressModal());
          dispatch(modalsSliceActions.openDepositFailModal());
          return Promise.resolve(false);
        },
      }),
      openBatchModal,
      transactions
    };
    return DepositBatch;

  } else if (tokenType == 'ICRC1') {

    var openBatchModal = () => {
      dispatch(
        modalsSliceActions.setDepositModalData({
          steps: ['getacnt', 'approve', 'deposit'] as DepositModalDataStep[],
          tokenSymbol: deposit.token?.symbol,
        })
      );
      dispatch(modalsSliceActions.openDepositProgressModal());
    };
    DepositBatch = { ...DepositBatch, openBatchModal };
    var getAcnt = intitICRCTokenDeposit();

    var approveTx = useICRCTransferMemo({ ...deposit, tokenAcnt: getAcnt }); // useICRCDepositMemo
    var depositTx = useDepositTransactionMemo(deposit);

    const DepositBatchTx = useMemo(() => {
      if(!getAcnt) return false;
      return new BatchTransact({ approve: approveTx, deposit: depositTx }, artemis);
    }, [getAcnt]);

    if (getAcnt) batchLoad = { state: "approve"  }
    else if(getAcnt ==false) batchLoad = { state: "error" }
    else batchLoad = { state: "getacnt" };

    if(DepositBatchTx){
      batchLoad.batchExecute = DepositBatchTx;
      DepositBatch = { ...DepositBatch, batch: batchLoad, openBatchModal }; 
    }

    DepositBatch = { ...DepositBatch, batch: batchLoad, openBatchModal };
    return DepositBatch;
  }
  else return DepositBatch

};
