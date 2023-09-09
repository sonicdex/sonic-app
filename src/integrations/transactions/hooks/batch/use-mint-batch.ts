import { useMemo } from 'react';
import { ENV } from '@/config';

import {
  MintTokenSymbol, modalsSliceActions, useAppDispatch, useSwapViewStore 
} from '@/store';

import {
  getMintWICPTransaction, getMintXTCTransaction, useApproveTransactionMemo,
  useDepositTransactionMemo, useLedgerTransferTransactionMemo,
} from '..';

import { BatchTransact } from 'artemis-web3-adapter';
import { artemis } from '@/integrations/artemis';

export type UseMintBatchOptions = {
  amountIn: string; amountOut: string; blockHeight?: string;
  keepInSonic?: boolean; tokenSymbol: MintTokenSymbol;
};

export const useMintBatch = ({ amountIn, amountOut, keepInSonic, tokenSymbol }: UseMintBatchOptions) => {
  const { tokenList } = useSwapViewStore();
  const dispatch = useAppDispatch();
  if (!tokenList) throw new Error('Token list is required');
  var batchLoad: any = { state: "idle" };

  const ledgerTransfer = (tokenSymbol === MintTokenSymbol.WICP) ?
    useLedgerTransferTransactionMemo({ toAccountId: ENV.accountIDs.WICP, amount: amountIn }) :
    (tokenSymbol === MintTokenSymbol.XTC) ?
      useLedgerTransferTransactionMemo({ toAccountId: ENV.accountIDs.XTC, amount: amountIn }) :
      false;

  const canisterPrincipalId = (tokenSymbol === MintTokenSymbol.WICP) ? ENV.canistersPrincipalIDs.WICP :
    (tokenSymbol === MintTokenSymbol.XTC) ? ENV.canistersPrincipalIDs.XTC : '';

  var _trx: any = { ledgerTransfer: ledgerTransfer };

  if (tokenSymbol === MintTokenSymbol.WICP) {
    _trx.mint = getMintWICPTransaction({ blockHeight: '' })
  } else if (tokenSymbol === MintTokenSymbol.XTC) {
    _trx.mint = getMintXTCTransaction({ blockHeight: '' })
  }

  if (keepInSonic) {
    const depositParams = { token: tokenList[canisterPrincipalId], amount: amountOut };
    const approve = useApproveTransactionMemo(depositParams);
    const deposit = useDepositTransactionMemo(depositParams);
    _trx.approve = approve; _trx.deposit = deposit;
  }

  const batchTrx = useMemo(() => { return new BatchTransact(_trx, artemis)}, []);

  if (batchTrx) {
    batchLoad.steps = batchTrx.stepsList;
    batchLoad.batchExecute = batchTrx;
    batchLoad.batchFnUpdate = true;
  }
  const openBatchModal = () => {
    const  steps: any = Object.keys(_trx).length?Object.keys(_trx):[];

    if (tokenSymbol === MintTokenSymbol.WICP) {
      dispatch(modalsSliceActions.setMintWICPModalData({steps:steps}));
      dispatch(modalsSliceActions.openMintWICPProgressModal());
    } else if (tokenSymbol === MintTokenSymbol.XTC) {
      dispatch(modalsSliceActions.setMintXTCModalData({ steps:steps }));
      dispatch(modalsSliceActions.openMintXTCProgressModal());
    }
  };

  return { batch: batchLoad, openBatchModal: openBatchModal };
};
