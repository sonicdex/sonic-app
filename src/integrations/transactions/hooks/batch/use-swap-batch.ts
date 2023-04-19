import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { modalsSliceActions, SwapModalDataStep, useAppDispatch, useSwapCanisterStore } from '@/store';
import { SwapModel } from '../..';

import {
  useApproveTransactionMemo, useBatch, useDepositTransactionMemo,
  useSwapExactTokensTransactionMemo, useWithdrawTransactionMemo,
  intitICRCTokenDeposit, useICRCDepositMemo
} from '..';

import { getAmountDependsOnBalance, getDepositTransactions } from './batch.utils';


export interface ExtraDepositSwapBatchOptions {
  keepInSonic: boolean;
}

export const useSwapBatch = ({ keepInSonic, ...swapParams }: SwapModel & ExtraDepositSwapBatchOptions) => {
  const dispatch = useAppDispatch();
  const { sonicBalances } = useSwapCanisterStore();

  if (!sonicBalances) throw new Error('Sonic balance is required');
  if (!swapParams.from.metadata || !swapParams.to.metadata) throw new Error('Tokens are required');

  const navigate = useNavigate();

  const depositParams = {
    token: swapParams.from.metadata,
    amount: getAmountDependsOnBalance(
      sonicBalances[swapParams.from.metadata.id],
      swapParams.from.metadata.decimals,
      swapParams.from.value
    ),
    allowance: swapParams.allowance,
    entryVal:'0'
  };
  const withdrawParams = { token: swapParams.to.metadata, amount: swapParams.to.value };
  var tokenType = depositParams.token?.tokenType;

  var batchLoad: any = { state: "idle" };
  var DepositBatch = { batch: batchLoad, openBatchModal: () => { } };

  if (tokenType == 'DIP20' || tokenType == 'YC') {

    var approve = useApproveTransactionMemo(depositParams);
    var deposit = useDepositTransactionMemo(depositParams);
    swapParams.entryVal = depositParams.amount;

    var swap = useSwapExactTokensTransactionMemo(swapParams);
    withdrawParams.amount = swap.amountOutMin?.toString();
    var withdraw = useWithdrawTransactionMemo(withdrawParams);

    const transactions = useMemo(() => {
      let _transactions = {};
      _transactions = { ...getDepositTransactions({ approveTx: approve, depositTx: deposit, tokenType: depositParams.token.tokenType }) };
      _transactions = { ..._transactions, swap };
      if (!keepInSonic) { _transactions = { ..._transactions, withdraw } };
      return _transactions;
    }, [...Object.values(swapParams), keepInSonic]);

    const openBatchModal = () => {
      dispatch(
        modalsSliceActions.setSwapModalData({
          steps: Object.keys(transactions) as SwapModalDataStep[],
          fromTokenSymbol: swapParams.from.metadata?.symbol,
          toTokenSymbol: swapParams.to.metadata?.symbol,
        })
      );
      dispatch(modalsSliceActions.openSwapProgressModal());
    };

    DepositBatch = {
      batch: useBatch<SwapModalDataStep>({
        transactions,
        handleRetry: () => {
          return new Promise<boolean>((resolve) => {
            dispatch(
              modalsSliceActions.setSwapModalData({
                callbacks: [
                  () => {
                    dispatch(modalsSliceActions.closeSwapFailModal());
                    openBatchModal(); resolve(true);
                  },
                  () => {
                    navigate(`/assets/withdraw?tokenId=${swapParams.from.metadata?.id}&amount=${swapParams.from.value}`);
                    dispatch(modalsSliceActions.closeSwapFailModal()); resolve(false);
                  },
                  () => { resolve(false); },
                ],
              })
            );
            dispatch(modalsSliceActions.closeSwapProgressModal());
            dispatch(modalsSliceActions.openSwapFailModal());
          });
        },
      }),
      openBatchModal,
    };

    return DepositBatch;
  } else if (tokenType == 'ICRC1') {

    var steps = ['swap', 'withdraw'];
    var reqAmt = parseFloat(depositParams.amount);

    if (reqAmt > 0) {
      steps = ['getacnt', 'approve', 'deposit', ...steps];
    }
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

    DepositBatch = { ...DepositBatch, openBatchModal };

    var getAcnt: any, approveTx: any, depositTx: any;

    if (reqAmt > 0) {
      getAcnt = intitICRCTokenDeposit(depositParams);
      approveTx = useICRCDepositMemo({ ...depositParams, tokenAcnt: getAcnt });
      depositTx = useDepositTransactionMemo(depositParams);
    }
    
    var swap = useSwapExactTokensTransactionMemo(swapParams);
    var withdraw = useWithdrawTransactionMemo(withdrawParams);

    var transactions = useMemo(() => {
      let _transactions = {};
      if (reqAmt > 0) {
        if (getAcnt && approveTx) {
          _transactions = {
            ...getDepositTransactions({ approveTx: {}, depositTx, txNames: ['approve', 'deposit'], tokenType: tokenType }), swap
          }
        }
      } else {
        _transactions = { ..._transactions, swap };
      }
      if (!keepInSonic) { _transactions = { ..._transactions, withdraw } };
      return _transactions;
    }, [approveTx]);

    if (Object.keys(transactions).includes('swap')) {
      batchLoad = useBatch<SwapModalDataStep>({
        transactions,
        handleRetry: () => {
          return new Promise<boolean>((resolve) => {
            dispatch(
              modalsSliceActions.setSwapModalData({
                callbacks: [
                  () => {
                    dispatch(modalsSliceActions.closeSwapFailModal());
                    openBatchModal(); resolve(true);
                  },
                  () => {
                    navigate(`/assets/withdraw?tokenId=${swapParams.from.metadata?.id}&amount=${swapParams.from.value}`);
                    dispatch(modalsSliceActions.closeSwapFailModal()); resolve(false);
                  },
                  () => { resolve(false); },
                ],
              })
            );
            dispatch(modalsSliceActions.closeSwapProgressModal());
            dispatch(modalsSliceActions.openSwapFailModal());
          });
        },
      });
      batchLoad.batchFnUpdate = true;
    } else {
      batchLoad = useBatch<SwapModalDataStep>({
        transactions: {},
        handleRetry: () => { return Promise.resolve(false) },
      });
      if (getAcnt) batchLoad = { state: "approve" }
      else batchLoad = { state: "getacnt" }
    }
    return DepositBatch = { ...DepositBatch, batch: batchLoad, openBatchModal}
  } else return DepositBatch;
};