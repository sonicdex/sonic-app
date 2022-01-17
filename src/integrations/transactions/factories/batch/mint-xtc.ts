import { useMemo } from 'react';

import { ENV } from '@/config';
import {
  MintXTCModalDataStep,
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useNotificationStore,
  useSwapViewStore,
} from '@/store';

import { Batch } from '../..';
import {
  useApproveTransactionMemo,
  useBatchHook,
  useDepositTransactionMemo,
  useLedgerTransferTransactionMemo,
} from '..';
import { useMintXTCTransactionMemo } from '../transactions/mint-xtc';

export type UseMintXTCBatchOptions = {
  keepInSonic?: boolean;
  amount: string;
};

export const useMintXTCBatch = ({
  amount,
  keepInSonic,
}: UseMintXTCBatchOptions) => {
  const { tokenList } = useSwapViewStore();
  const dispatch = useAppDispatch();
  const { addNotification } = useNotificationStore();

  if (!tokenList) throw new Error('Token list is required');

  const depositParams = {
    token: tokenList[ENV.canistersPrincipalIDs.XTC],
    amount: amount.toString(),
  };

  const ledgerTransfer = useLedgerTransferTransactionMemo({
    toAccountId: ENV.accountIDs.XTC,
    amount,
  });
  const mintXTC = useMintXTCTransactionMemo(
    {},
    undefined,
    // TODO: Add strict types
    (err: any, prevTransactionsData: any) => {
      const blockHeight = (
        prevTransactionsData?.[0]?.response as bigint | undefined
      )?.toString();
      addNotification({
        title: `The minting of XTC is failed, please use DFX to finish minting your XTC "dfx canister --no-wallet --network ic call ${ENV.canistersPrincipalIDs.XTC} mint '(0, ${blockHeight})'"`,
        type: NotificationType.Error,
        timeout: 'none',
        id: Date.now().toString(),
      });
    }
  );
  const approve = useApproveTransactionMemo(depositParams);
  const deposit = useDepositTransactionMemo(depositParams);

  const transactions = useMemo(() => {
    let transactions: Partial<Record<MintXTCModalDataStep, any>> = {
      ledgerTransfer,
      mintXTC,
    };

    if (keepInSonic) {
      transactions = {
        ...transactions,
        approve,
        deposit,
      };
    }

    return transactions;
  }, [ledgerTransfer, mintXTC, approve, deposit, keepInSonic]);

  const handleOpenBatchModal = () => {
    dispatch(
      modalsSliceActions.setMintXTCModalData({
        steps: Object.keys(transactions) as MintXTCModalDataStep[],
      })
    );
    dispatch(modalsSliceActions.openMintXTCProgressModal());
  };

  return [
    useBatchHook({
      transactions,
      handleRetry: () => {
        dispatch(modalsSliceActions.closeMintXTCProgressModal());
        return Promise.resolve(false);
      },
    }),
    handleOpenBatchModal,
  ] as [Batch.Hook<MintXTCModalDataStep>, () => void];
};
