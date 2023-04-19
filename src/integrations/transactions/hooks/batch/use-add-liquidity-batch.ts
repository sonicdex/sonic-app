import { useMemo } from 'react';

import { AddLiquidityModalDataStep, modalsSliceActions, useAppDispatch, useLiquidityViewStore, useSwapCanisterStore } from '@/store';

import { AddLiquidity, Deposit } from '../..';
import {
  useAddLiquidityTransactionMemo, useApproveTransactionMemo, useBatch, useDepositTransactionMemo,
  intitICRCTokenDeposit, useICRCDepositMemo
} from '..';
import { useCreatePairTransactionMemo } from '../transactions/create-pair';

import { getAmountDependsOnBalance, getDepositTransactions } from './batch.utils';

interface Transactions {
  [transactionName: string]: any;
}

export const useAddLiquidityBatch = (addLiquidityParams: AddLiquidity) => {

  const dispatch = useAppDispatch();
  const { sonicBalances } = useSwapCanisterStore();
  const { pair } = useLiquidityViewStore();

  if (!sonicBalances) { throw new Error('Sonic balance are required'); }
  if (!addLiquidityParams.token0.metadata || !addLiquidityParams.token1.metadata) {
    throw new Error('Tokens are required');
  }

  const deposit0Params = useMemo(() => {
    if (addLiquidityParams.token0.metadata) {
      return {
        token: addLiquidityParams.token0.metadata,
        amount: getAmountDependsOnBalance(
          sonicBalances[addLiquidityParams.token0.metadata?.id],
          addLiquidityParams.token0.metadata.decimals, addLiquidityParams.token0.value
        ),
        allowance: addLiquidityParams.allowance0,
      };
    }
  }, [sonicBalances, addLiquidityParams.token0]) as Deposit;

  const deposit1Params = useMemo(() => {
    if (addLiquidityParams.token1.metadata) {
      return {
        token: addLiquidityParams.token1.metadata,
        amount: getAmountDependsOnBalance(
          sonicBalances[addLiquidityParams.token1.metadata?.id],
          addLiquidityParams.token1.metadata.decimals, addLiquidityParams.token1.value
        ),
        allowance: addLiquidityParams.allowance1,
      };
    }
  }, [sonicBalances, addLiquidityParams.token1]) as Deposit;

  const createPairParams = useMemo(() => {
    return {
      token0: addLiquidityParams.token0,
      token1: addLiquidityParams.token1,
    };
  }, [addLiquidityParams.token0, addLiquidityParams.token1]);

  var approve0: any, deposit0: any, approve1: any, deposit1: any, steps: any = [];
  var tx1complete = false, tx2complete = false;
  var getAcnt0: any, approveTx1:any, getAcnt1: any, approveTx2: any;
  //var trxStat: string = '', getAcnt0: any, getAcnt1: any, getAcnt2: any, approveTx1: any, approveTx2: any;

  var batchLoad: any = { state: "idle" };
  var DepositBatch = { batch: batchLoad, openBatchModal: () => { } };

  var token0Type = addLiquidityParams.token0.metadata.tokenType;
  var token1Type = addLiquidityParams.token1.metadata.tokenType;

  var token0Amt = parseFloat(deposit0Params?.amount ? deposit0Params?.amount : '0');
  var token1Amt = parseFloat(deposit1Params?.amount ? deposit1Params?.amount : '0');

  if (token0Amt > 0) {
    if ((token0Type == 'DIP20' || token0Type == 'YC')) {
      approve0 = useApproveTransactionMemo(deposit0Params);
      deposit0 = useDepositTransactionMemo(deposit0Params);
      steps = ['approve0', 'deposit0'];
      tx1complete = true;

    } else if (token0Type == 'ICRC1') {

      getAcnt0 = intitICRCTokenDeposit(deposit0Params);
      approveTx1 = useICRCDepositMemo({ ...deposit0Params, tokenAcnt: getAcnt0 });
      deposit0 = useDepositTransactionMemo(deposit0Params);

      if(getAcnt0 && approveTx1?.resp)tx1complete=true;

      steps = [ 'approve0','deposit0'];
    }
  } else tx1complete = true;

  if (token1Amt > 0) {
    if (token1Type == 'DIP20' || token1Type == 'YC') {

      approve1 = useApproveTransactionMemo(deposit1Params);
      deposit1 = useDepositTransactionMemo(deposit1Params);
      steps = [...steps,'approve1', 'deposit1'];

      if(tx1complete) tx2complete = true;
      else tx2complete = false;

    } else if (token1Type == 'ICRC1') {

      getAcnt1 = intitICRCTokenDeposit(deposit1Params);      
      deposit1 = useDepositTransactionMemo(deposit1Params);
      approveTx2 = useICRCDepositMemo({ ...deposit1Params, tokenAcnt: getAcnt1 });
      
      if(getAcnt1 && approveTx2?.resp && tx1complete) tx2complete=true;
      else tx2complete=false;
      
      steps = [...steps,'approve1', 'deposit1'];
    }
  } else tx2complete = true;

  var createPair = useCreatePairTransactionMemo(createPairParams);
  var addLiquidity = useAddLiquidityTransactionMemo(addLiquidityParams);

  const transactions = useMemo(() => {
    let _transactions: Transactions = {};

    if (!pair) {
      steps = [...steps, 'createPair'];
      _transactions = { ..._transactions, createPair }
    }

    if (token0Amt > 0)
      if ((token0Type == 'DIP20' || token0Type == 'YC')) {
        _transactions = {
          ..._transactions,
          ...getDepositTransactions({ txNames: ['approve0', 'deposit0'], approveTx: approve0, depositTx: deposit0, tokenType: 'DIP20' }),
        };
      } else if (token0Type == 'ICRC1') {
        _transactions = {
          ..._transactions,
          ...getDepositTransactions({ txNames: ['approve0', 'deposit0'], approveTx: {}, depositTx: deposit0, tokenType: 'ICRC1' }),
        };
      }

    if (token1Amt > 0)
      if (token1Type == 'DIP20' || token1Type == 'YC') {
        _transactions = {
          ..._transactions,
          ...getDepositTransactions({ txNames: ['approve1', 'deposit1'], approveTx: approve1, depositTx: deposit1, tokenType: 'DIP20' }),
        };
      } else if (token1Type == 'ICRC1') {
        _transactions = {
          ..._transactions,
          ...getDepositTransactions({ txNames: ['approve1', 'deposit1'], approveTx: {}, depositTx: deposit1, tokenType: 'ICRC1' }),
        };
      }
    steps = [...steps, 'addLiquidity']
    _transactions = { ..._transactions, addLiquidity };
    return _transactions;
  }, [steps])


  const handleRetry = async () => {
    return new Promise<boolean>((resolve) => {
      dispatch(
        modalsSliceActions.setAddLiquidityModalData({
          callbacks: [
            // Retry callback
            () => {
              dispatch(modalsSliceActions.closeAddLiquidityFailModal());
              openBatchModal();
              resolve(true);
            },
            // Cancel callback
            () => {
              dispatch(modalsSliceActions.closeAddLiquidityFailModal());
              resolve(false);
            },
          ],
        })
      );

      dispatch(modalsSliceActions.closeAddLiquidityProgressModal());
      dispatch(modalsSliceActions.openAddLiquidityFailModal());
    });
  };

  const openBatchModal = () => {
    dispatch(
      modalsSliceActions.setAddLiquidityModalData({
        steps: steps as AddLiquidityModalDataStep[],
        token0Symbol: addLiquidityParams.token0.metadata?.symbol,
        token1Symbol: addLiquidityParams.token1.metadata?.symbol,
      })
    );

    dispatch(modalsSliceActions.openAddLiquidityProgressModal());
  };

  //console.log('tx1complete && tx2complete', tx1complete , tx2complete);

  if (tx1complete && tx2complete) {
   // console.log(transactions);
    batchLoad = useBatch<AddLiquidityModalDataStep>({ transactions, handleRetry });
    batchLoad.batchFnUpdate = true;
  } else {
    batchLoad = useBatch<AddLiquidityModalDataStep>({ transactions: {},handleRetry:handleRetry });
    batchLoad = { state: "idle" };
    if(token0Amt > 0 && token0Type == 'ICRC1' && !tx1complete){
      batchLoad.state= "approve0" ;
    }else if(token1Amt > 0 && token1Type == 'ICRC1' && tx1complete && !tx2complete){
      batchLoad.state= "approve1" ;
    }
  }

  DepositBatch = { ...DepositBatch, batch: batchLoad, openBatchModal }
  return DepositBatch;
};

  /// v1
  // if (token0Type == 'DIP20' || token0Type == 'YC') {
  //   steps = [...steps, 'approve0', 'deposit0']
  //   approve0 = useApproveTransactionMemo(deposit0Params);
  //   deposit0 = useDepositTransactionMemo(deposit0Params);
  // } else if (token0Type == 'ICRC1') {
  //   if (parseFloat(deposit0Params?.amount ? deposit0Params?.amount : '0') > 0) {
  //     getAcnt0 = intitICRCTokenDeposit(deposit0Params);
  //     steps = [...steps, 'approve0', 'deposit0'];
  //     approveTx1 = useICRCDepositMemo({ ...deposit0Params, tokenAcnt: getAcnt0 });
  //     deposit0 = useDepositTransactionMemo(deposit0Params);
  //   }

  // }

  // if (parseFloat(deposit0Params?.amount ? deposit0Params?.amount : '0') <= 0) { steps = []; }


  // if (token1Type == 'DIP20' || token0Type == 'YC') {
  //   steps = [...steps, 'approve1', 'deposit1']
  //   approve1 = useApproveTransactionMemo(deposit1Params);
  //   deposit1 = useDepositTransactionMemo(deposit1Params);
  //   trxStat = 'DIP20';
  // } else if (addLiquidityParams.token0.metadata.tokenType == 'ICRC1') {
  //   if (parseFloat(deposit1Params?.amount ? deposit1Params?.amount : '0') > 0) {
  //     getAcnt2 = intitICRCTokenDeposit(deposit1Params);
  //     steps = [...steps, 'approve1', 'deposit1'];
  //     approveTx2 = useICRCDepositMemo({ ...deposit1Params, tokenAcnt: getAcnt0 });
  //     deposit1 = useDepositTransactionMemo(deposit1Params);
  //     trxStat = 'ICRC1';
  //   }
  // }
  // if (parseFloat(deposit1Params?.amount ? deposit1Params?.amount : '0') <= 0) { steps = [...steps, 'approve0', 'deposit0'] }


  // getAcnt1; getAcnt2; approveTx2; approveTx1;



  // var createPair = useCreatePairTransactionMemo(createPairParams);
  // var addLiquidity = useAddLiquidityTransactionMemo(addLiquidityParams);

  // const transactions = useMemo(() => {
  //   let _transactions: Transactions = {};
  //   if (!pair) {
  //     steps = [...steps, 'createPair']
  //     _transactions = { ..._transactions, createPair }
  //   }

  //   if (addLiquidityParams.token0.metadata) {
  //     if (token0Type == 'DIP20' || token0Type == 'YC') {
  //       _transactions = {
  //         ..._transactions,
  //         ...getDepositTransactions({ txNames: ['approve0', 'deposit0'], approveTx: approve0, depositTx: deposit0, tokenType: 'DIP20' }),
  //       };
  //     } else if (token0Type == 'ICRC1') {
  //       _transactions = {
  //         ..._transactions,
  //         ...getDepositTransactions({ txNames: ['approve0', 'deposit0'], approveTx: {}, depositTx: deposit0, tokenType: 'ICRC1' }),
  //       };
  //     }
  //   }

  //   if (addLiquidityParams.token1.metadata) {
  //     if (token1Type == 'DIP20' || token0Type == 'YC') {
  //       _transactions = {
  //         ..._transactions,
  //         ...getDepositTransactions({ txNames: ['approve1', 'deposit1'], approveTx: approve1, depositTx: deposit1, tokenType: 'DIP20' }),
  //       };
  //     } else if (token1Type == 'ICRC1') {
  //       _transactions = {
  //         ..._transactions,
  //         ...getDepositTransactions({ txNames: ['approve1', 'deposit1'], approveTx: {}, depositTx: deposit1, tokenType: 'ICRC1' }),
  //       };
  //     }
  //   }
  //   _transactions = { ..._transactions, addLiquidity };
  //   return _transactions;
  // }, [trxStat]);

  // steps = [...steps, 'addLiquidity']

  // // console.log(steps);

  // const handleRetry = async () => {
  //   return new Promise<boolean>((resolve) => {
  //     dispatch(
  //       modalsSliceActions.setAddLiquidityModalData({
  //         callbacks: [
  //           // Retry callback
  //           () => {
  //             dispatch(modalsSliceActions.closeAddLiquidityFailModal());
  //             openBatchModal();
  //             resolve(true);
  //           },
  //           // Cancel callback
  //           () => {
  //             dispatch(modalsSliceActions.closeAddLiquidityFailModal());
  //             resolve(false);
  //           },
  //         ],
  //       })
  //     );

  //     dispatch(modalsSliceActions.closeAddLiquidityProgressModal());
  //     dispatch(modalsSliceActions.openAddLiquidityFailModal());
  //   });
  // };

  // const openBatchModal = () => {
  //   dispatch(
  //     modalsSliceActions.setAddLiquidityModalData({
  //       steps: steps as AddLiquidityModalDataStep[],
  //       token0Symbol: addLiquidityParams.token0.metadata?.symbol,
  //       token1Symbol: addLiquidityParams.token1.metadata?.symbol,
  //     })
  //   );

  //   dispatch(modalsSliceActions.openAddLiquidityProgressModal());
  // };

  // console.log(transactions);


  // batchLoad = useBatch<AddLiquidityModalDataStep>({ transactions, handleRetry });

  // DepositBatch = { ...DepositBatch, batch: batchLoad, openBatchModal }

  // return DepositBatch;

