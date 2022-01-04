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

export const WICP_ACCOUNT_ID =
  'cc659fe529756bae6f72db9937c6c60cf7ad57eb4ac5f930a75748927aab469a';

type Wrap = {
  keepInSonic?: boolean;
  amount: string;
};

export const useWrapBatch = ({ amount, keepInSonic = false }: Wrap) => {
  const { tokenList } = useSwapViewStore();
  const dispatch = useAppDispatch();
  const { addNotification } = useNotificationStore();

  const depositParams = {
    token: tokenList![ENV.canisterIds.WICP],
    amount: amount.toString(),
  };

  const ledgerTransfer = useLedgerTransferTransactionMemo({
    toAccountId: WICP_ACCOUNT_ID,
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
        title: `The minting of WICP is failed, please use DFX to finish minting your WICP "dfx canister --no-wallet --network ic call utozz-siaaa-aaaam-qaaxq-cai mint '(0, ${blockHeight})'"`,
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
