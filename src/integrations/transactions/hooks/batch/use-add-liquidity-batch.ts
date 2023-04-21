import { useMemo } from 'react';

import { AddLiquidityModalDataStep, modalsSliceActions, useAppDispatch, useLiquidityViewStore, useSwapCanisterStore } from '@/store';

import { AddLiquidity, Deposit } from '../..';
import {
  useAddLiquidityTransactionMemo, useApproveTransactionMemo, useBatch, useDepositTransactionMemo,
  intitICRCTokenDeposit, useICRCTransferMemo, //useICRCDepositMemo
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
  var tx0complete = false, tx1complete = false, getICRCAcnt: any, TrxLoaded = 0;

  // getAcnt0: any, approveTx0: any, getAcnt1: any, approveTx2: any;

  var batchLoad: any = { state: "idle" };
  var DepositBatch = { batch: batchLoad, openBatchModal: () => { } };

  var token0Type = addLiquidityParams.token0.metadata.tokenType;
  var token1Type = addLiquidityParams.token1.metadata.tokenType;

  var token0Amt = parseFloat(deposit0Params?.amount ? deposit0Params?.amount : '0');
  var token1Amt = parseFloat(deposit1Params?.amount ? deposit1Params?.amount : '0');


  if (!pair) { steps = ['createPair'] }

  if (token0Type == 'ICRC1' || token1Type == 'ICRC1') {
    getICRCAcnt = intitICRCTokenDeposit(); steps = [...steps, 'getacnt'];
  }

  //step 1
  if (token0Amt > 0) {
    if (token0Type == 'DIP20' || token0Type == 'YC') {
      approve0 = useApproveTransactionMemo(deposit0Params);
      deposit0 = useDepositTransactionMemo(deposit0Params);

      if (deposit0) tx0complete = true;
    } else if (token0Type == 'ICRC1') {

      approve0 = useICRCTransferMemo({ ...deposit0Params, tokenAcnt: getICRCAcnt });
      deposit0 = useDepositTransactionMemo(deposit0Params);

      if (getICRCAcnt) tx0complete = true;
    }
    steps = [...steps, 'approve0', 'deposit0'];
  } else tx0complete = true;

  //step 2
  if (token1Amt > 0) {
    if (token1Type == 'DIP20' || token1Type == 'YC') {
      approve1 = useApproveTransactionMemo(deposit1Params);
      deposit1 = useDepositTransactionMemo(deposit1Params);

      if (tx0complete && deposit1) tx1complete = true;
    } else if (token1Type == 'ICRC1') {
      approve1 = useICRCTransferMemo({ ...deposit1Params, tokenAcnt: getICRCAcnt });
      deposit1 = useDepositTransactionMemo(deposit1Params);

      if (getICRCAcnt && approve1) tx1complete = true;
    }
    steps = [...steps, 'approve1', 'deposit1'];
  } else tx1complete = true;

  // useAddLiquidityTransactionMemo; getDepositTransactions; deposit1; deposit0;
  const createPair = useCreatePairTransactionMemo(createPairParams);
  const addLiquidity = useAddLiquidityTransactionMemo(addLiquidityParams);

  //addLiquidity;

  if (tx1complete && tx0complete) TrxLoaded = 1;
  const TrxFull = useMemo(() => {

    console.log('called here TrxFull .. .. .')

    let _transactions: Transactions = {};
    if (!pair) { _transactions = { ..._transactions, createPair } }

    if (token0Amt > 0) {
      _transactions = {
        ..._transactions,
        ...getDepositTransactions({ txNames: ['approve0', 'deposit0'], approveTx: approve0, depositTx: deposit0, tokenType: token0Type })
      }
    }
    if (token1Amt > 0) {
      _transactions = {
        ..._transactions,
        ...getDepositTransactions({ txNames: ['approve1', 'deposit1'], approveTx: approve1, depositTx: deposit1, tokenType: token0Type })
      }
    }
    _transactions = { ..._transactions, addLiquidity };

    return _transactions;
  }, [TrxLoaded])

  steps = [...steps, 'addLiquidity'];

  const handleRetry = async () => {
    return new Promise<boolean>((resolve) => {
      dispatch(
        modalsSliceActions.setAddLiquidityModalData({
          callbacks: [
            () => { // Retry callback
              dispatch(modalsSliceActions.closeAddLiquidityFailModal());
              openBatchModal(); resolve(true);
            },
            () => { // Cancel callback
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

  if (TrxLoaded) {
    batchLoad = useBatch<AddLiquidityModalDataStep>({ transactions: TrxFull, handleRetry });
    batchLoad.batchFnUpdate = true;
  } else {
    batchLoad = useBatch<AddLiquidityModalDataStep>({ transactions: {}, handleRetry: () => { return Promise.resolve(false) } });
    if (steps.includes('getacnt')) batchLoad = { state: "getacnt" };
    else batchLoad = { state: "idle" }
  }
  DepositBatch = { ...DepositBatch, batch: batchLoad, openBatchModal };
  return DepositBatch;
};