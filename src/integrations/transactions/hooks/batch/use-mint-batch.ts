// import { TransactionPrevResponse } from '@memecake/plug-inpage-provider/dist/src/Provider/interfaces';
import { useMemo, useEffect, useState } from 'react';
import { ENV } from '@/config';
// import { MINT_AUTO_NOTIFICATION_TITLES } from '@/notifications';

import {
  MintTokenSymbol, modalsSliceActions,useAppDispatch, useSwapViewStore,  //useWalletStore //addNotification, NotificationType, //MintModalData  addNotification, MintModalDataStep , useModalsStore , NotificationState , NotificationType
} from '@/store';

import {
  getMintWICPTransaction, getMintXTCTransaction, useApproveTransactionMemo,
  useDepositTransactionMemo, useLedgerTransferTransactionMemo,
} from '..';

import { BatchTransact } from 'artemis-web3-adapter';
import { artemis } from '@/integrations/artemis';

export type UseMintBatchOptions = {
  amountIn: string; amountOut: string;blockHeight?: string;
  keepInSonic?: boolean; tokenSymbol: MintTokenSymbol;
};

export const useMintBatch = ({ amountIn, amountOut, keepInSonic, tokenSymbol }: UseMintBatchOptions) => {
  const { tokenList } = useSwapViewStore();
  const dispatch = useAppDispatch();
  if (!tokenList) throw new Error('Token list is required');
  var batchLoad: any = { state: "idle" }, Steps: any = [];

  const ledgerTransfer = (tokenSymbol === MintTokenSymbol.WICP) ?
    useLedgerTransferTransactionMemo({ toAccountId: ENV.accountIDs.WICP, amount: amountIn }) :
    (tokenSymbol === MintTokenSymbol.XTC) ?
      useLedgerTransferTransactionMemo({ toAccountId: ENV.accountIDs.XTC, amount: amountIn }) :
      false;

  if (ledgerTransfer) Steps = ['ledgerTransfer', 'mint'];
  if (keepInSonic) Steps = [...Steps, 'approve', 'deposit'];

  const [blockHeight, setBlockHeight] = useState('');
  
  const canisterPrincipalId = (tokenSymbol === MintTokenSymbol.WICP) ? ENV.canistersPrincipalIDs.WICP :
    (tokenSymbol === MintTokenSymbol.XTC) ? ENV.canistersPrincipalIDs.XTC : '';

  const depositParams = { token: tokenList[canisterPrincipalId], amount: amountOut };
  
  useEffect(() => {
    const batchTrx1 = new BatchTransact({ ledgerTransfer: ledgerTransfer }, artemis);
    batchTrx1.execute().then((data: any) => {
      if (data) setBlockHeight(data?.ledgerTransfer);
      else { batchLoad.batchFnUpdate = false; setBlockHeight('');}
    }).catch((error: any) => {
      batchLoad.batchFnUpdate = false;setBlockHeight('error');
    });
  }, [ledgerTransfer])

  const approve = useApproveTransactionMemo(depositParams);
  const deposit = useDepositTransactionMemo(depositParams);

  const MintBatchTrx = useMemo(() => {
    if (!blockHeight) return false;
    if (blockHeight =='error') return 'error';
    var _trx: any = {};
    if (tokenSymbol === MintTokenSymbol.WICP) {
      _trx.mint = getMintWICPTransaction({ blockHeight: blockHeight })
    } else if (tokenSymbol === MintTokenSymbol.XTC) {
      _trx.mint = getMintXTCTransaction({ blockHeight: blockHeight })
    }
    
    if (keepInSonic) { _trx.approve = approve; _trx.deposit = deposit;}

    return new BatchTransact(_trx, artemis);
  }, [blockHeight]);
  if (!blockHeight || blockHeight =='error' || blockHeight =='') { batchLoad.state = 'ledgerTransfer' }

  if (MintBatchTrx && MintBatchTrx!='error') {
    batchLoad.batchExecute = MintBatchTrx;
    batchLoad.batchFnUpdate = true;
  }else if(MintBatchTrx =='error'){
    batchLoad.batchFnUpdate = 'error';
  } 

  const openBatchModal = () => {
    const steps = Steps;
    if (tokenSymbol === MintTokenSymbol.WICP) {
      dispatch(modalsSliceActions.setMintWICPModalData({ steps }));
      dispatch(modalsSliceActions.openMintWICPProgressModal());
    } else if (tokenSymbol === MintTokenSymbol.XTC) {
      dispatch(modalsSliceActions.setMintXTCModalData({ steps }));
      dispatch(modalsSliceActions.openMintXTCProgressModal());
    }
  };

  return { batch: batchLoad, openBatchModal: openBatchModal };

  // const { mintXTCUncompleteBlockHeights, mintWICPUncompleteBlockHeights } = useModalsStore();


  // const { canisterPrincipalId, canisterAccountID, mintTransaction, openFailModal, openBatchModal } = useMemo(() => {
  //   const getMintTransaction = () => {
  //     const mintTransactionData = {
  //       [MintTokenSymbol.XTC]: {
  //         handler: getMintXTCTransaction,
  //         uncompleteBlockHeights: mintXTCUncompleteBlockHeights,
  //         setMintUncompleteBlockHeights: modalsSliceActions.setMintXTCUncompleteBlockHeights,
  //       },
  //       [MintTokenSymbol.WICP]: {
  //         handler: getMintWICPTransaction,
  //         uncompleteBlockHeights: mintWICPUncompleteBlockHeights,
  //         setMintUncompleteBlockHeights: modalsSliceActions.setMintWICPUncompleteBlockHeights,
  //       },
  //     };
  //     const { handler, uncompleteBlockHeights, setMintUncompleteBlockHeights } = mintTransactionData[tokenSymbol];

  //     return handler({ blockHeight }, () => null, (err: any, prevResponses: TransactionPrevResponse[]) => {
  //       const failedBlockHeight = prevResponses?.[0]?.response as | bigint | undefined;
  //       if (failedBlockHeight) {
  //         dispatch(setMintUncompleteBlockHeights([...(uncompleteBlockHeights ? uncompleteBlockHeights : []), String(failedBlockHeight)]));
  //       }
  //       updateFailedBlockHeight({ prevResponses, tokenSymbol, principalId });

  //       if (failedBlockHeight) {
  //         dispatch(
  //           addNotification({
  //             id: String(new Date().getTime()), title: MINT_AUTO_NOTIFICATION_TITLES[NotificationState.Error],
  //             type: NotificationType.MintAuto, state: NotificationState.Error,
  //           })
  //         );
  //       }
  //     }
  //     );
  //   };

  //   if (tokenSymbol === MintTokenSymbol.WICP) {
  //     return {
  //       canisterPrincipalId: ENV.canistersPrincipalIDs.WICP, canisterAccountID: ENV.accountIDs.WICP,

  //       openBatchModal: () => {
  //         const steps = Object.keys(_transactions) as MintModalData['steps'];
  //         dispatch(modalsSliceActions.setMintWICPModalData({ steps }));
  //         dispatch(modalsSliceActions.openMintWICPProgressModal());
  //       },
  //       openFailModal: () => {
  //         dispatch(modalsSliceActions.closeMintWICPProgressModal());
  //         dispatch(modalsSliceActions.openMintWICPFailModal());
  //       },
  //       mintTransaction: getMintTransaction(),
  //     };
  //   }

  //   if (tokenSymbol === MintTokenSymbol.XTC) {
  //     return {
  //       canisterPrincipalId: ENV.canistersPrincipalIDs.XTC,
  //       canisterAccountID: ENV.accountIDs.XTC,
  //       openBatchModal: () => {
  //         const steps = Object.keys(_transactions) as MintModalData['steps'];
  //         dispatch(modalsSliceActions.setMintXTCModalData({ steps }));
  //         dispatch(modalsSliceActions.openMintXTCProgressModal());
  //       },
  //       openFailModal: () => {
  //         dispatch(modalsSliceActions.closeMintXTCProgressModal());
  //         dispatch(modalsSliceActions.openMintXTCFailModal());
  //       },
  //       mintTransaction: getMintTransaction(),
  //     };
  //   }

  //   return { canisterPrincipalId: '', canisterAccountID: '', mintTransaction: null, openBatchModal: () => null, openFailModal: () => null };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [blockHeight, dispatch, mintWICPUncompleteBlockHeights, mintXTCUncompleteBlockHeights, principalId, tokenSymbol]);

  // const depositParams = { token: tokenList[canisterPrincipalId], amount: amountOut };
  // const ledgerTransfer = useLedgerTransferTransactionMemo({ toAccountId: canisterAccountID, amount: amountIn });

  // const approve = useApproveTransactionMemo(depositParams);
  // const deposit = useDepositTransactionMemo(depositParams);



  // const _transactions = useMemo(() => {
  //   let transactions: Partial<Record<MintModalDataStep, any>> = { [MintModalDataStep.Mint]: mintTransaction };
  //   if (!blockHeight) { transactions = { ledgerTransfer, ...transactions } }
  //   if (keepInSonic) { transactions = { ...transactions, approve, deposit }; }
  //   return transactions;
  // }, [ledgerTransfer, mintTransaction, blockHeight, approve, deposit, keepInSonic]);

  // const BatchMint = useMemo(() => {
  //   return new BatchTransact(_transactions, artemis);
  // }, [_transactions]);

  // if (BatchMint) {
  //   batchLoad.batchExecute = BatchMint;
  //   // batchLoad.handleRetry = async (error:any, prevResponses:any) => {
  //   //     return new Promise((resolve) => {
  //   //       const setMintModalData =
  //   //         tokenSymbol === MintTokenSymbol.WICP
  //   //           ? modalsSliceActions.setMintWICPModalData
  //   //           : modalsSliceActions.setMintXTCModalData;

  //   //       dispatch(
  //   //         setMintModalData({
  //   //           callbacks: [
  //   //             // Retry callback
  //   //             () => {
  //   //               dispatch(modalsSliceActions.closeMintWICPFailModal());
  //   //               dispatch(modalsSliceActions.closeMintXTCFailModal());
  //   //               openBatchModal();
  //   //               resolve({ nextTxArgs: prevResponses });
  //   //             },
  //   //             // Close callback
  //   //             () => {
  //   //               dispatch(modalsSliceActions.closeMintWICPFailModal());
  //   //               dispatch(modalsSliceActions.closeMintXTCFailModal());
  //   //               resolve(false);
  //   //             },
  //   //           ],
  //   //         })
  //   //       );

  //   //       openFailModal();
  //   //      });
  // }
  // openFailModal;
  // return { batch: batchLoad, openBatchModal };

  // const batch = useBatch<MintModalDataStep>({
  //   transactions: _transactions,
  //   handleRetry: async (error, prevResponses) => {
  //     return new Promise((resolve) => {
  //       const setMintModalData =
  //         tokenSymbol === MintTokenSymbol.WICP
  //           ? modalsSliceActions.setMintWICPModalData
  //           : modalsSliceActions.setMintXTCModalData;

  //       dispatch(
  //         setMintModalData({
  //           callbacks: [
  //             // Retry callback
  //             () => {
  //               dispatch(modalsSliceActions.closeMintWICPFailModal());
  //               dispatch(modalsSliceActions.closeMintXTCFailModal());
  //               openBatchModal();
  //               resolve({ nextTxArgs: prevResponses });
  //             },
  //             // Close callback
  //             () => {
  //               dispatch(modalsSliceActions.closeMintWICPFailModal());
  //               dispatch(modalsSliceActions.closeMintXTCFailModal());
  //               resolve(false);
  //             },
  //           ],
  //         })
  //       );

  //       openFailModal();
  //     });
  //   },
  // });

  // return { batch, openBatchModal };
};
