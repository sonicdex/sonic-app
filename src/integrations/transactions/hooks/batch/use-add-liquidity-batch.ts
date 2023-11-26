import { useMemo } from 'react';

import { AddLiquidityModalDataStep, modalsSliceActions, useAppDispatch, useLiquidityViewStore, useSwapCanisterStore } from '@/store';

import { AddLiquidity, Deposit } from '../..';
import {
  useAddLiquidityTransactionMemo, useApproveTransactionMemo, useDepositTransactionMemo, 
  intitICRCTokenDepositIn, useICRCTransferMemo, useIcrc2Approve,
} from '..';

import { useCreatePairTransactionMemo } from '../transactions/create-pair';

import { getAmountDependsOnBalance } from './batch.utils';

interface Transactions { [transactionName: string]: any;}

import { BatchTransact } from 'artemis-web3-adapter';
import { artemis } from '@/integrations/artemis';


export const useAddLiquidityBatch = (addLiquidityParams: AddLiquidity) => {
  const dispatch = useAppDispatch();
  var batchLoad: any = { state: "idle" };
  const { sonicBalances } = useSwapCanisterStore();
  const { pair } = useLiquidityViewStore();

  if (!sonicBalances) {
     return { batch: batchLoad, openBatchModal: () => { } };
  }
  if (!addLiquidityParams.token0.metadata || !addLiquidityParams.token1.metadata) {
    return { batch: batchLoad, openBatchModal: () => { } };
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
  }, []) as Deposit;

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
  }, []) as Deposit;

  const createPairParams = useMemo(() => {
    return {
      token0: addLiquidityParams.token0,
      token1: addLiquidityParams.token1,
    };
  }, []);

  var approve0: any, deposit0: any, approve1: any, deposit1: any, steps: any = [];
  var tx0complete = false, tx1complete = false, getICRCAcnt: any;

  var DepositBatch = { batch: batchLoad, openBatchModal: () => { } };

  var token0Type = addLiquidityParams.token0.metadata.tokenType?.toLowerCase();
  var token1Type = addLiquidityParams.token1.metadata.tokenType?.toLowerCase();

  var token0Amt = parseFloat(deposit0Params?.amount ? deposit0Params?.amount : '0');
  var token1Amt = parseFloat(deposit1Params?.amount ? deposit1Params?.amount : '0');

  if (!pair) { steps = ['createPair'] }

  if (token0Type == 'icrc1' || token1Type == 'icrc1') {
    getICRCAcnt = intitICRCTokenDepositIn(); steps = [...steps, 'getacnt'];
  }

  //step 1
  if (token0Amt > 0) {
    if (token0Type == 'dip20' || token0Type == 'yc') {
      approve0 = useApproveTransactionMemo(deposit0Params);
      deposit0 = useDepositTransactionMemo(deposit0Params);
      if (deposit0) tx0complete = true;
    } else if (token0Type == 'icrc1') {
      approve0 = useICRCTransferMemo({ ...deposit0Params, tokenAcnt: getICRCAcnt });
      deposit0 = useDepositTransactionMemo(deposit0Params);
      if (getICRCAcnt) tx0complete = true;
    }else if (token0Type == 'icrc2') {
      approve0 = useIcrc2Approve({ ...deposit0Params });
      deposit0 = useDepositTransactionMemo(deposit0Params);
      if (deposit0) tx0complete = true;
    }
    steps = [...steps, 'approve0', 'deposit0'];
  } else tx0complete = true;

  //step 2
  if (token1Amt > 0) {
    if (token1Type == 'dip20' || token1Type == 'yc') {
      approve1 = useApproveTransactionMemo(deposit1Params);
      deposit1 = useDepositTransactionMemo(deposit1Params);
      if (tx0complete && deposit1) tx1complete = true;
    } else if (token1Type == 'icrc1') {
      approve1 = useICRCTransferMemo({ ...deposit1Params, tokenAcnt: getICRCAcnt });
      deposit1 = useDepositTransactionMemo(deposit1Params);
      if (getICRCAcnt && approve1) tx1complete = true;
    }else if (token1Type == 'icrc2') {
      approve0 = useIcrc2Approve({ ...deposit1Params });
      deposit0 = useDepositTransactionMemo(deposit1Params);
      if (tx0complete && deposit1) tx1complete = true;
    }
    steps = [...steps, 'approve1', 'deposit1'];
  } else tx1complete = true;

  const createPair = useCreatePairTransactionMemo(createPairParams);
  const addLiquidity = useAddLiquidityTransactionMemo(addLiquidityParams);

  const LiquidityBatchTx = useMemo(() => {
    let _transactions: Transactions = {};
    if (!pair) { _transactions = { ..._transactions, createPair } }
    if (token0Amt > 0) {
      _transactions = {..._transactions,approve0:approve0, deposit0:deposit0}
    }
    if (token1Amt > 0) {
      _transactions = {..._transactions,approve1:approve1,deposit1:deposit1}
    }
    _transactions = { ..._transactions, addLiquidity };
     
    return new BatchTransact(_transactions, artemis);
  }, [getICRCAcnt]);

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

  if(LiquidityBatchTx && tx0complete &&tx1complete  ){
    batchLoad.batchExecute = LiquidityBatchTx;
    batchLoad.handleRetry = handleRetry; 
    batchLoad.batchFnUpdate=true;
  }else {
    if(!getICRCAcnt){  batchLoad.state = 'getacnt';}
  }

  DepositBatch = { ...DepositBatch, batch: batchLoad, openBatchModal };
   return DepositBatch
};