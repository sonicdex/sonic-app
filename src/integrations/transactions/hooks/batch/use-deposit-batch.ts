import { useMemo, useState, useEffect } from 'react';

import { DepositModalDataStep, modalsSliceActions, useAppDispatch } from '@/store';

import { Deposit } from '../..';
import { useApproveTransactionMemo, useDepositTransactionMemo, useBatch, intitICRCTokenDeposit , useICRCDepositMemo } from '..';

import { getDepositTransactions } from '.';


interface depositBatchType { batch: any, openBatchModal: any };

export const useDepositBatch = (deposit: Deposit): depositBatchType => {
  const dispatch = useAppDispatch();
  var DepositBatch: any;

  if (deposit.token?.tokenType == 'DIP20' || deposit.token?.tokenType == 'YC') {
    const approveTx = useApproveTransactionMemo(deposit);
    const depositTx = useDepositTransactionMemo(deposit);
    var transactions = useMemo(
      () =>
        getDepositTransactions({ approveTx, depositTx, txNames: ['approve', 'deposit'] }),
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
    console.log('transactions', transactions);

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
  } else if (deposit.token?.tokenType == 'ICRC1') {

    
    const [tokenAcnt, setResult] = useState('');

    useEffect(() => {
      let active = true;load();
      return () => { active = false };
      async function load() {
        var res = await intitICRCTokenDeposit();
        if (!active) { return };setResult(res)
      }
    }, [tokenAcnt]);


    if (tokenAcnt!='') {
      var trx2={}

      console.log('tokenAcnt', tokenAcnt);

      trx2 = useMemo( () => useICRCDepositMemo( deposit ,tokenAcnt),[deposit, tokenAcnt]); 
    /// useICRCDepositMemo(deposit , tokenAcnt)

      var openBatchModal = () => {
        dispatch(
          modalsSliceActions.setDepositModalData({
            steps: Object.keys(trx2) as DepositModalDataStep[],
            tokenSymbol: deposit.token?.symbol,
          })
        );
        dispatch(modalsSliceActions.openDepositProgressModal());
      };
    
      
      DepositBatch = {
        batch:{
          trx2,
          handleRetry: () => { 
            dispatch(modalsSliceActions.closeDepositProgressModal());
            dispatch(modalsSliceActions.openDepositFailModal());
            return Promise.resolve(false);
          },
        },
        openBatchModal
      }
    }
  }
  return DepositBatch;
};
