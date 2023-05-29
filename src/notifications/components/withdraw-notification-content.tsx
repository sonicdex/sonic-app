import { Link } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';

import { useBalances } from '@/hooks/use-balances';
import { useWithdrawBatch } from '@/integrations/transactions/hooks/batch/use-withdraw-batch';
import {
  modalsSliceActions, NotificationType, useAppDispatch, useNotificationStore,
  useSwapCanisterStore, useWithdrawViewStore, WithdrawModalDataStep,
} from '@/store';

import { AppLog } from '@/utils';

export interface WithdrawNotificationContentProps { id: string; }

export const WithdrawNotificationContent: React.FC<
  WithdrawNotificationContentProps
> = ({ id }) => {
  const dispatch = useAppDispatch();
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances } = useBalances();
  const { amount: value, tokenId } = useWithdrawViewStore();
  const { supportedTokenList } = useSwapCanisterStore();

  const selectedToken = useMemo(() => {
    if (tokenId && supportedTokenList) {
      return supportedTokenList.find(({ id }) => id === tokenId);
    }
    return undefined;
  }, [supportedTokenList, tokenId]);

  var batchData = useWithdrawBatch({ amount: value, token: selectedToken });

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
      if (Object.values(WithdrawModalDataStep).includes(batch?.state as WithdrawModalDataStep)) {
        dispatch(modalsSliceActions.setWithdrawModalData({ step: batch?.state as WithdrawModalDataStep }));
      }
    }
  };

  const handleOpenModal = () => { handleStateChange(); openBatchModal() };

  const handleError = (err?: any) => {
    if (err) AppLog.error(`Deposit Error`, err);

    dispatch(modalsSliceActions.clearWithdrawModalData());
    dispatch(modalsSliceActions.closeWithdrawProgressModal());

    addNotification({
      title: `Withdraw ${value} ${selectedToken?.symbol} failed`, type: NotificationType.Error, id: Date.now().toString(),
    });
    popNotification(id);
  }

  useEffect(handleStateChange, [batchExecutalbe?.activeStep, batch.state]);
  
  useEffect(() => {
    handleOpenModal();
    if (batchExecutalbe?.execute) {
      batchExecutalbe.execute().then((data: any) => {
        if (data) {
          dispatch(modalsSliceActions.clearWithdrawModalData());
          dispatch(modalsSliceActions.closeWithdrawProgressModal());
          addNotification({
            title: `Withdrawn ${value} ${selectedToken?.symbol}`, type: NotificationType.Success,
            id: Date.now().toString(), transactionLink: '/activity'
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
