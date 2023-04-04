import { useMemo, useEffect } from 'react'; //useEffect , useState

import { DepositModalDataStep, modalsSliceActions, useAppDispatch } from '@/store';

import { Deposit } from '../..';
import { useApproveTransactionMemo, useDepositTransactionMemo, useBatch, intitICRCTokenDeposit, useICRCDepositMemo, useICRCDepositInit, useICRCDepositEff } from '..';  // useICRCDepositMemo  //useICRCDepositInit  intitICRCTokenDeposit // useICRCDepositMemo

import { getDepositTransactions } from '.';
import { getTokenActor, fromHexString } from '@/utils';

// import { Principal } from '@dfinity/principal'; 
// import { ENV } from '@/config';
// import { parseAmount } from '@/utils/format';


intitICRCTokenDeposit; useICRCDepositMemo; useICRCDepositInit; useICRCDepositEff; useEffect; getTokenActor; fromHexString;

// interface depositBatchType { batch: any, openBatchModal: any };

export const useDepositBatch = (deposit: Deposit): any => {
  const dispatch = useAppDispatch();

  var batchLoad: any = { state: "idle" };
  var DepositBatch = { batch: batchLoad, openBatchModal: () => { } };
  var tokenType = deposit.token?.tokenType;

  // console.log('render');

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
    };
    return DepositBatch
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
    var getAcnt = intitICRCTokenDeposit(deposit);
    var approveTx: any = useICRCDepositMemo({ ...deposit, tokenAcnt: getAcnt });
    var depositTx = useDepositTransactionMemo(deposit);
    var transactions = useMemo(() => {
      // Object.keys(approveTx).length>0

      if (getAcnt && approveTx)
        return getDepositTransactions({ approveTx: {}, depositTx, txNames: ['approve', 'deposit'], tokenType: deposit.token?.tokenType })
      else return {}
    }, [approveTx]);

    if (Object.keys(transactions).length > 0) {
      batchLoad = useBatch<DepositModalDataStep>({
        transactions,
        handleRetry: () => {
          dispatch(modalsSliceActions.closeDepositProgressModal());
          dispatch(modalsSliceActions.openDepositFailModal());
          return Promise.resolve(false);
        },
      });
      batchLoad.batchFnUpdate = true;
    } else {
      batchLoad = useBatch<DepositModalDataStep>({
        transactions: {},
        handleRetry: () => { return Promise.resolve(false) },
      });
      if (getAcnt)
        batchLoad = { state: "approve" }
      else
        batchLoad = { state: "getacnt" }
    }
    return DepositBatch = {
      ...DepositBatch, batch: batchLoad, openBatchModal
    }
  }
  else return DepositBatch

};
