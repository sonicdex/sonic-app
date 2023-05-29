import { Link } from '@chakra-ui/react';
import { Principal } from '@dfinity/principal';
import { deserialize, serialize } from '@memecake/sonic-js';
import { useEffect, useMemo } from 'react';

import { useBalances } from '@/hooks/use-balances';
import { useWithdrawWICPBatch } from '@/integrations/transactions';
import {
  modalsSliceActions, NotificationType, useAppDispatch, useNotificationStore, useWalletStore,
  useSwapViewStore, WithdrawWICPModalDataStep,
} from '@/store';

import { AppLog } from '@/utils';
import { getAccountId } from '@/utils/icp';

export interface WithdrawWICPNotificationContentProps {
  id: string;
}

export const WithdrawWICPNotificationContent: React.FC<WithdrawWICPNotificationContentProps> = ({ id }) => {
  const { principalId } = useWalletStore();
  const dispatch = useAppDispatch();
  const swapViewStore = useSwapViewStore();
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances } = useBalances();

  const { from } = useMemo(() => {
    const { from } = swapViewStore;
    return deserialize(serialize({ from }));
  }, []) ?? {};

  const batchData = useWithdrawWICPBatch({
    amount: from.value,
    toAccountId: principalId ? getAccountId(Principal.fromText(principalId)) : undefined,
  });

  const batch = batchData?.batch, openBatchModal = batchData?.openBatchModal;
  const batchExecutalbe = batch?.batchExecute;
  
  const handleStateChange = () => {
    if (!batch?.state) return;
    if (batch?.state && batchExecutalbe?.state == "running") {
      batch.state = batchExecutalbe.activeStep;
    } else if (batch?.state == 'error') {
      handleError();
    }
    if (batch?.state) {
      if (Object.values(WithdrawWICPModalDataStep).includes(batch?.state as WithdrawWICPModalDataStep)) {
        dispatch(modalsSliceActions.setWithdrawWICPModalData({ step: batch?.state as WithdrawWICPModalDataStep }));
      }
    }
  };


  const handleError = (err?: any) => {
    if (err) AppLog.error(`Deposit Error`, err);
    dispatch(modalsSliceActions.closeWithdrawWICPProgressModal());
    addNotification({
      title: `Unwrap ${from.value} ${from.metadata.symbol} failed`,
      type: NotificationType.Error,
      id: Date.now().toString(),
    });
    popNotification(id);
  }

  const handleOpenModal = () => {
    handleStateChange();
    openBatchModal();
  };

  useEffect(handleStateChange, [batchExecutalbe?.activeStep, batch.state]);

  useEffect(() => {
    handleOpenModal();
    if (batchExecutalbe?.execute) {
      batchExecutalbe.execute().then((data: any) => {
        if (data) {
          dispatch(modalsSliceActions.closeWithdrawWICPProgressModal());
          addNotification({
            title: `Unwrapped ${from.value} ${from.metadata.symbol}`, type: NotificationType.Success,
            id: Date.now().toString(),transactionLink: '/activity',
          });
          getBalances();
        } else handleError();
      }).catch((err: any) => handleError(err)).finally(() => popNotification(id));
    }
  }, []);

  return (
    <Link target="_blank" rel="noreferrer" color="dark-blue.500" onClick={handleOpenModal}>
      View progress
    </Link>
  );
};
