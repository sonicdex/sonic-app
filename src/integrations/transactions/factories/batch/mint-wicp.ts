import { useMemo } from 'react';

import { ENV } from '@/config';
import {
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useNotificationStore,
  useSwapViewStore,
  WrapModalDataStep,
} from '@/store';

import { Batch } from '../..';
import { useBatchHook } from '..';
import {
  useApproveTransactionMemo,
  useDepositTransactionMemo,
  useLedgerTransferTransactionMemo,
  useMintWICPTransactionMemo,
} from '../transactions';

type UseMintWICPBatchOptions = {
  keepInSonic?: boolean;
  amount: string;
};

export const useMintWICPBatch = ({
  amount,
  keepInSonic = false,
}: UseMintWICPBatchOptions) => {
  const { tokenList } = useSwapViewStore();
  const dispatch = useAppDispatch();
  const { addNotification } = useNotificationStore();

  if (!tokenList) throw new Error('Token list is required');

  const depositParams = {
    token: tokenList[ENV.canistersPrincipalIDs.WICP],
    amount: amount.toString(),
  };

  const ledgerTransfer = useLedgerTransferTransactionMemo({
    toAccountId: ENV.accountIDs.WICP,
    amount,
  });
  const mintWICP = useMintWICPTransactionMemo(
    {},
    undefined,
    // TODO: Add strict types
    (err: any, prevTransactionsData: any) => {
      const blockHeight = (
        prevTransactionsData?.[0]?.response as bigint | undefined
      )?.toString();
      addNotification({
        title: `The minting of WICP is failed, please use DFX to finish minting your WICP "dfx canister --network ic call ${ENV.canistersPrincipalIDs.WICP} mint '(null, ${blockHeight}:nat64)'"`,
        type: NotificationType.Error,
        timeout: 'none',
        id: Date.now().toString(),
      });
    }
  );
  const approve = useApproveTransactionMemo(depositParams);
  const deposit = useDepositTransactionMemo(depositParams);

  const transactions = useMemo(() => {
    let transactions: Partial<Record<WrapModalDataStep, any>> = {
      ledgerTransfer,
      mintWICP,
    };

    if (keepInSonic) {
      transactions = {
        ...transactions,
        approve,
        deposit,
      };
    }

    return transactions;
  }, [ledgerTransfer, mintWICP, approve, deposit, keepInSonic]);

  const handleOpenBatchModal = () => {
    dispatch(
      modalsSliceActions.setWrapModalData({
        steps: Object.keys(transactions) as WrapModalDataStep[],
      })
    );
    dispatch(modalsSliceActions.openWrapProgressModal());
  };

  return [
    useBatchHook({
      transactions,
      handleRetry: () => {
        dispatch(modalsSliceActions.closeWrapProgressModal());
        return Promise.resolve(false);
      },
    }),
    handleOpenBatchModal,
  ] as [Batch.Hook<WrapModalDataStep>, () => void];
};
