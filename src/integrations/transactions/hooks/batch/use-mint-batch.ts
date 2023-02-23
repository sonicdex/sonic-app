import { TransactionPrevResponse } from '@memecake/plug-inpage-provider/dist/src/Provider/interfaces';
import { useMemo } from 'react';

import { ENV } from '@/config';
import { MINT_AUTO_NOTIFICATION_TITLES } from '@/notifications';
import {
  addNotification,
  MintModalData,
  MintModalDataStep,
  MintTokenSymbol,
  modalsSliceActions,
  NotificationState,
  NotificationType,
  useAppDispatch,
  useModalsStore,
  usePlugStore,
  useSwapViewStore,
} from '@/store';

import {
  getMintWICPTransaction,
  getMintXTCTransaction,
  useApproveTransactionMemo,
  useBatch,
  useDepositTransactionMemo,
  useLedgerTransferTransactionMemo,
} from '..';
import { updateFailedBlockHeight } from '.';

export type UseMintBatchOptions = {
  amountIn: string;
  amountOut: string;
  blockHeight?: string;
  keepInSonic?: boolean;
  tokenSymbol: MintTokenSymbol;
};

export const useMintBatch = ({
  amountIn,
  amountOut,
  blockHeight,
  keepInSonic,
  tokenSymbol,
}: UseMintBatchOptions) => {
  const { tokenList } = useSwapViewStore();
  const { principalId } = usePlugStore();
  const dispatch = useAppDispatch();

  const { mintXTCUncompleteBlockHeights, mintWICPUncompleteBlockHeights } =
    useModalsStore();

  if (!tokenList) throw new Error('Token list is required');

  const {
    canisterPrincipalId,
    canisterAccountID,
    mintTransaction,
    openFailModal,
    openBatchModal,
  } = useMemo(() => {
    const getMintTransaction = () => {
      const mintTransactionData = {
        [MintTokenSymbol.XTC]: {
          handler: getMintXTCTransaction,
          uncompleteBlockHeights: mintXTCUncompleteBlockHeights,
          setMintUncompleteBlockHeights:
            modalsSliceActions.setMintXTCUncompleteBlockHeights,
        },
        [MintTokenSymbol.WICP]: {
          handler: getMintWICPTransaction,
          uncompleteBlockHeights: mintWICPUncompleteBlockHeights,
          setMintUncompleteBlockHeights:
            modalsSliceActions.setMintWICPUncompleteBlockHeights,
        },
      };
      const { handler, uncompleteBlockHeights, setMintUncompleteBlockHeights } =
        mintTransactionData[tokenSymbol];

      return handler(
        { blockHeight },
        () => null,
        (err: any, prevResponses: TransactionPrevResponse[]) => {
          const failedBlockHeight = prevResponses?.[0]?.response as
            | bigint
            | undefined;

          if (failedBlockHeight) {
            dispatch(
              setMintUncompleteBlockHeights([
                ...(uncompleteBlockHeights ? uncompleteBlockHeights : []),
                String(failedBlockHeight),
              ])
            );
          }

          updateFailedBlockHeight({
            prevResponses,
            tokenSymbol,
            principalId,
          });

          if (failedBlockHeight) {
            dispatch(
              addNotification({
                id: String(new Date().getTime()),
                title: MINT_AUTO_NOTIFICATION_TITLES[NotificationState.Error],
                type: NotificationType.MintAuto,
                state: NotificationState.Error,
              })
            );
          }
        }
      );
    };

    if (tokenSymbol === MintTokenSymbol.WICP) {
      return {
        canisterPrincipalId: ENV.canistersPrincipalIDs.WICP,
        canisterAccountID: ENV.accountIDs.WICP,
        openBatchModal: () => {
          const steps = Object.keys(_transactions) as MintModalData['steps'];

          dispatch(modalsSliceActions.setMintWICPModalData({ steps }));
          dispatch(modalsSliceActions.openMintWICPProgressModal());
        },
        openFailModal: () => {
          dispatch(modalsSliceActions.closeMintWICPProgressModal());
          dispatch(modalsSliceActions.openMintWICPFailModal());
        },
        mintTransaction: getMintTransaction(),
      };
    }

    if (tokenSymbol === MintTokenSymbol.XTC) {
      return {
        canisterPrincipalId: ENV.canistersPrincipalIDs.XTC,
        canisterAccountID: ENV.accountIDs.XTC,
        openBatchModal: () => {
          const steps = Object.keys(_transactions) as MintModalData['steps'];

          dispatch(modalsSliceActions.setMintXTCModalData({ steps }));
          dispatch(modalsSliceActions.openMintXTCProgressModal());
        },
        openFailModal: () => {
          dispatch(modalsSliceActions.closeMintXTCProgressModal());
          dispatch(modalsSliceActions.openMintXTCFailModal());
        },
        mintTransaction: getMintTransaction(),
      };
    }

    return {
      canisterPrincipalId: '',
      canisterAccountID: '',
      mintTransaction: null,
      openBatchModal: () => null,
      openFailModal: () => null,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    blockHeight,
    dispatch,
    mintWICPUncompleteBlockHeights,
    mintXTCUncompleteBlockHeights,
    principalId,
    tokenSymbol,
  ]);

  const depositParams = {
    token: tokenList[canisterPrincipalId],
    amount: amountOut,
  };

  const ledgerTransfer = useLedgerTransferTransactionMemo({
    toAccountId: canisterAccountID,
    amount: amountIn,
  });
  const approve = useApproveTransactionMemo(depositParams);
  const deposit = useDepositTransactionMemo(depositParams);

  const _transactions = useMemo(() => {
    let transactions: Partial<Record<MintModalDataStep, any>> = {
      [MintModalDataStep.Mint]: mintTransaction,
    };

    if (!blockHeight) {
      transactions = {
        ledgerTransfer,
        ...transactions,
      };
    }

    if (keepInSonic) {
      transactions = {
        ...transactions,
        approve,
        deposit,
      };
    }

    return transactions;
  }, [
    ledgerTransfer,
    mintTransaction,
    blockHeight,
    approve,
    deposit,
    keepInSonic,
  ]);

  const batch = useBatch<MintModalDataStep>({
    transactions: _transactions,
    handleRetry: async (error, prevResponses) => {
      return new Promise((resolve) => {
        const setMintModalData =
          tokenSymbol === MintTokenSymbol.WICP
            ? modalsSliceActions.setMintWICPModalData
            : modalsSliceActions.setMintXTCModalData;

        dispatch(
          setMintModalData({
            callbacks: [
              // Retry callback
              () => {
                dispatch(modalsSliceActions.closeMintWICPFailModal());
                dispatch(modalsSliceActions.closeMintXTCFailModal());
                openBatchModal();
                resolve({ nextTxArgs: prevResponses });
              },
              // Close callback
              () => {
                dispatch(modalsSliceActions.closeMintWICPFailModal());
                dispatch(modalsSliceActions.closeMintXTCFailModal());
                resolve(false);
              },
            ],
          })
        );

        openFailModal();
      });
    },
  });

  return { batch, openBatchModal };
};
