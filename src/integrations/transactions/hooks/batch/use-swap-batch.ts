import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { modalsSliceActions, SwapModalDataStep, useAppDispatch, useSwapCanisterStore } from '@/store';

import { SwapModel } from '../..';
import {
  useApproveTransactionMemo, useBatch, useDepositTransactionMemo, useSwapExactTokensTransactionMemo, useWithdrawTransactionMemo,
  intitICRCTokenDeposit, useICRCDepositMemo
} from '..';

import { getAmountDependsOnBalance, getDepositTransactions } from './batch.utils';

export interface ExtraDepositSwapBatchOptions { keepInSonic: boolean }

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
  };

  const withdrawParams = { token: swapParams.to.metadata, amount: swapParams.to.value };
  var approve = false, deposit = false, getAcnt: any = false, icrcTrx = false;


  if (swapParams.from.metadata.tokenType == 'DIP20') {
    approve = useApproveTransactionMemo(depositParams);
    deposit = useDepositTransactionMemo(depositParams);
  } else if (swapParams.from.metadata.tokenType == 'ICRC1') {
    approve = false, deposit; false;
    getAcnt = intitICRCTokenDeposit(deposit);
    
    if (getAcnt) {
      icrcTrx = useICRCDepositMemo({ ...depositParams, tokenAcnt: getAcnt });
      icrcTrx;
    }
    deposit = useDepositTransactionMemo(depositParams);
  }


  const swap = useSwapExactTokensTransactionMemo(swapParams);
  const withdraw = useWithdrawTransactionMemo(withdrawParams);

  const transactions = useMemo(() => {
    let _transactions = {};
    _transactions = { ...getDepositTransactions({ approveTx: approve, depositTx: deposit }) };
    _transactions = { ..._transactions, swap };
    if (!keepInSonic) { _transactions = { ..._transactions, withdraw }; }

    return _transactions;
  }, [...Object.values(swapParams), keepInSonic]);

  const handleRetry = async () => {
    return new Promise<boolean>((resolve) => {
      dispatch(
        modalsSliceActions.setSwapModalData({
          callbacks: [
            // Retry callback
            () => {
              dispatch(modalsSliceActions.closeSwapFailModal());
              openBatchModal();
              resolve(true);
            },
            // Withdraw callback
            () => {
              navigate(
                `/assets/withdraw?tokenId=${swapParams.from.metadata?.id}&amount=${swapParams.from.value}`
              );
              dispatch(modalsSliceActions.closeSwapFailModal());
              resolve(false);
            },
            // Close callback
            () => {
              resolve(false);
            },
          ],
        })
      );
      dispatch(modalsSliceActions.closeSwapProgressModal());
      dispatch(modalsSliceActions.openSwapFailModal());
    });
  };

  var openBatchModal = () => {
    dispatch(
      modalsSliceActions.setSwapModalData({
        steps: Object.keys(transactions) as SwapModalDataStep[],
        fromTokenSymbol: swapParams.from.metadata?.symbol,
        toTokenSymbol: swapParams.to.metadata?.symbol,
      })
    );
    dispatch(modalsSliceActions.openSwapProgressModal());
  };

  return { batch: useBatch<SwapModalDataStep>({ transactions, handleRetry }), openBatchModal };
};
