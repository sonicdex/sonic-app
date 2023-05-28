import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { modalsSliceActions, SwapModalDataStep, useAppDispatch, useSwapCanisterStore } from '@/store';
import { SwapModel } from '../..';


import {
  useApproveTransactionMemo, useDepositTransactionMemo,
  useSwapExactTokensTransactionMemo, useWithdrawTransactionMemo,
  intitICRCTokenDeposit, useICRCTransferMemo, // useICRCDepositMemo , 
} from '..';

intitICRCTokenDeposit; useICRCTransferMemo;

import { getAmountDependsOnBalance } from './batch.utils';

import { BatchTransact } from 'artemis-web3-adapter';
import { artemis } from '@/integrations/artemis';

export interface ExtraDepositSwapBatchOptions {
  keepInSonic: boolean;
}

export const useSwapBatch = ({ keepInSonic, ...swapParams }: SwapModel & ExtraDepositSwapBatchOptions) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sonicBalances } = useSwapCanisterStore();
  navigate;
  if (!sonicBalances) throw new Error('Sonic balance is required');
  if (!swapParams.from.metadata || !swapParams.to.metadata) throw new Error('Tokens are required');

  const depositParams = {
    token: swapParams.from.metadata,
    amount: getAmountDependsOnBalance(sonicBalances[swapParams.from.metadata.id],
      swapParams.from.metadata.decimals,
      swapParams.from.value
    ),
    allowance: swapParams.allowance,
    entryVal: '0'
  };
  const withdrawParams = { token: swapParams.to.metadata, amount: swapParams.to.value };
  var tokenType = depositParams.token?.tokenType;

  var batchLoad: any = { state: "idle" };
  var SwapBatch = { batch: batchLoad, openBatchModal: () => { } };

  if (tokenType == 'DIP20' || tokenType == 'YC') {
    const approve = useApproveTransactionMemo(depositParams);
    const deposit = useDepositTransactionMemo(depositParams);
    swapParams.entryVal = depositParams.amount;
    const swap = useSwapExactTokensTransactionMemo(swapParams);
    withdrawParams.amount = swap.amountOutMin?.toString();
    const withdraw = useWithdrawTransactionMemo(withdrawParams);

    const SwapBatchTrx = useMemo(() => {
      var _transactions: any = { approve: approve, deposit: deposit, swap: swap };
      if (!keepInSonic) { _transactions = { ..._transactions, withdraw: withdraw } };
      return new BatchTransact(_transactions, artemis);
    }, [withdraw]);

    const openBatchModal = () => {
      dispatch(
        modalsSliceActions.setSwapModalData({
          steps: SwapBatchTrx.stepsList as SwapModalDataStep[],
          fromTokenSymbol: swapParams.from.metadata?.symbol,
          toTokenSymbol: swapParams.to.metadata?.symbol,
        })
      );
      dispatch(modalsSliceActions.openSwapProgressModal());
    };

    if (SwapBatchTrx) {
      batchLoad.batchExecute = SwapBatchTrx;
      batchLoad.batchFnUpdate = true;
    }
    SwapBatch = { batch: batchLoad, openBatchModal };
    return SwapBatch;
  } else if (tokenType == 'ICRC1') {
    var steps = ['swap']; 
    if (!keepInSonic) steps = [ 'swap' , 'withdraw']
    var reqAmt = parseFloat(depositParams.amount);
    if (reqAmt > 0) { steps = ['getacnt', 'approve', 'deposit', ...steps]; }

    const openBatchModal = () => {
      dispatch(
        modalsSliceActions.setSwapModalData({
          steps: steps as SwapModalDataStep[],
          fromTokenSymbol: swapParams.from.metadata?.symbol,
          toTokenSymbol: swapParams.to.metadata?.symbol,
        })
      );
      dispatch(modalsSliceActions.openSwapProgressModal());
    };
    
    SwapBatch = { ...SwapBatch, openBatchModal };
    const getAcnt = intitICRCTokenDeposit();
    const approveTx = useICRCTransferMemo({ ...depositParams, tokenAcnt: getAcnt });
    const depositTx = useDepositTransactionMemo(depositParams);

    const swap = useSwapExactTokensTransactionMemo(swapParams);
    const withdraw = useWithdrawTransactionMemo(withdrawParams);

    const SwapBatchTrx = useMemo(() => {
      if(!getAcnt) return false;
      let _transactions: any = { approve: approveTx, deposit: depositTx, swap: swap };
      if (!keepInSonic) { _transactions = { ..._transactions, withdraw: withdraw } };
      return new BatchTransact(_transactions, artemis);
    }, [getAcnt]);
    if(!getAcnt)  batchLoad.state = 'getacnt';
    if (SwapBatchTrx) {
      batchLoad.batchExecute = SwapBatchTrx;
      batchLoad.batchFnUpdate = true;
    }
    SwapBatch = { batch: batchLoad, openBatchModal };
    return SwapBatch;
  } else return SwapBatch;



  // if (tokenType == 'DIP20' || tokenType == 'YC') {

  //   const approve = useApproveTransactionMemo(depositParams);
  //   const deposit = useDepositTransactionMemo(depositParams);
  //   swapParams.entryVal = depositParams.amount;

  //   const swap = useSwapExactTokensTransactionMemo(swapParams);
  //   withdrawParams.amount = swap.amountOutMin?.toString();
  //   const withdraw = useWithdrawTransactionMemo(withdrawParams);

  //   const transactions = useMemo(() => {
  //     let _transactions = {};
  //     _transactions = { ...getDepositTransactions({ approveTx: approve, depositTx: deposit, tokenType: depositParams.token.tokenType }) };
  //     _transactions = { ..._transactions, swap };
  //     if (!keepInSonic) { _transactions = { ..._transactions, withdraw } };
  //     return _transactions;
  //   }, [...Object.values(swapParams), keepInSonic]);

  //   const openBatchModal = () => {
  //     dispatch(
  //       modalsSliceActions.setSwapModalData({
  //         steps: Object.keys(transactions) as SwapModalDataStep[],
  //         fromTokenSymbol: swapParams.from.metadata?.symbol,
  //         toTokenSymbol: swapParams.to.metadata?.symbol,
  //       })
  //     );
  //     dispatch(modalsSliceActions.openSwapProgressModal());
  //   };

  //   batchLoad = useBatch<SwapModalDataStep>({
  //     transactions,
  //     handleRetry: () => {
  //       return new Promise<boolean>((resolve) => {
  //         dispatch(
  //           modalsSliceActions.setSwapModalData({
  //             callbacks: [
  //               () => {
  //                 dispatch(modalsSliceActions.closeSwapFailModal());
  //                 openBatchModal(); resolve(true);
  //               },
  //               () => {
  //                 navigate(`/assets/withdraw?tokenId=${swapParams.from.metadata?.id}&amount=${swapParams.from.value}`);
  //                 dispatch(modalsSliceActions.closeSwapFailModal()); resolve(false);
  //               },
  //               () => { resolve(false); },
  //             ],
  //           })
  //         );
  //         dispatch(modalsSliceActions.closeSwapProgressModal());
  //         dispatch(modalsSliceActions.openSwapFailModal());
  //       });
  //     },
  //   });

  //   if(batchLoad.execute) batchLoad.batchFnUpdate = true;

  //   return DepositBatch = { batch: batchLoad, openBatchModal};

  // } else if (tokenType == 'ICRC1') {

  //   var steps = ['swap', 'withdraw'];
  //   var reqAmt = parseFloat(depositParams.amount);

  //   if (reqAmt > 0) {
  //     steps = ['getacnt', 'approve', 'deposit', ...steps];
  //   }

  //   const openBatchModal = () => {
  //     dispatch(
  //       modalsSliceActions.setSwapModalData({
  //         steps: steps as SwapModalDataStep[],
  //         fromTokenSymbol: swapParams.from.metadata?.symbol,
  //         toTokenSymbol: swapParams.to.metadata?.symbol,
  //       })
  //     );
  //     dispatch(modalsSliceActions.openSwapProgressModal());
  //   };

  //   DepositBatch = { ...DepositBatch, openBatchModal };

  //   var getAcnt: any, approveTx: any, depositTx: any;

  //   getAcnt = intitICRCTokenDeposit(); 
  //   approveTx = useICRCTransferMemo({ ...depositParams, tokenAcnt: getAcnt });
  //   depositTx = useDepositTransactionMemo(depositParams);

  //   const swap = useSwapExactTokensTransactionMemo(swapParams);
  //   const withdraw = useWithdrawTransactionMemo(withdrawParams);

  //   const transactions = useMemo(() => {
  //     let _transactions = {};
  //     if (reqAmt > 0) {
  //       if (getAcnt) {
  //         _transactions = {
  //           ...getDepositTransactions({ approveTx: approveTx, depositTx, txNames: ['approve', 'deposit'], tokenType: tokenType }), swap
  //         }
  //       }
  //     } else {
  //       _transactions = { ..._transactions, swap };
  //     }
  //     if (!keepInSonic) { _transactions = { ..._transactions, withdraw } };
  //     return _transactions;
  //   }, [approveTx]);

  //   if (Object.keys(transactions).includes('swap')) {
  //     batchLoad = useBatch<SwapModalDataStep>({
  //       transactions,
  //       handleRetry: () => {
  //         return new Promise<boolean>((resolve) => {
  //           dispatch(
  //             modalsSliceActions.setSwapModalData({
  //               callbacks: [
  //                 () => {
  //                   dispatch(modalsSliceActions.closeSwapFailModal());
  //                   openBatchModal(); resolve(true);
  //                 },
  //                 () => {
  //                   navigate(`/assets/withdraw?tokenId=${swapParams.from.metadata?.id}&amount=${swapParams.from.value}`);
  //                   dispatch(modalsSliceActions.closeSwapFailModal()); resolve(false);
  //                 },
  //                 () => { resolve(false); },
  //               ],
  //             })
  //           );
  //           dispatch(modalsSliceActions.closeSwapProgressModal());
  //           dispatch(modalsSliceActions.openSwapFailModal());
  //         });
  //       },
  //     });
  //     batchLoad.batchFnUpdate = true;
  //   } else {
  //     batchLoad = useBatch<SwapModalDataStep>({
  //       transactions: {},
  //       handleRetry: () => { return Promise.resolve(false) },
  //     });
  //     if (getAcnt) batchLoad = { state: "approve" }
  //     else batchLoad = { state: "getacnt" }
  //   }
  //   return DepositBatch = { ...DepositBatch, batch: batchLoad, openBatchModal}
  // } else return DepositBatch;
};