import { Link } from '@chakra-ui/react';
import { deserialize, serialize } from '@memecake/sonic-js';
import { useEffect, useMemo } from 'react';
import { useBalances } from '@/hooks/use-balances';

import { useTransferBatch } from '@/integrations/transactions';

import {
  TransferModalDataStep, modalsSliceActions, useAppDispatch, useTransferViewStore, NotificationType, useNotificationStore,
} from '@/store';

import { tokenList, AppLog } from '@/utils';

export interface TransferNotificationContentProps { id: string }

export const TransferNotificationContent: React.FC<TransferNotificationContentProps> = ({ id }) => {
  const dispatch = useAppDispatch();

  const { addNotification, popNotification } = useNotificationStore(), { getBalances } = useBalances();
  const transferViewStore = useTransferViewStore();

  const { value, tokenId } = useMemo(() => {
    const { amount: value, tokenId  } = transferViewStore;
    return deserialize(serialize({ value, tokenId }));
  }, []) ?? {};

  const selectedToken = tokenList('obj', tokenId);
  var batchData = useTransferBatch({ amount: value, token: selectedToken});

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
      if (Object.values(TransferModalDataStep).includes(batch?.state as TransferModalDataStep)) {
        dispatch(modalsSliceActions.setTransferModalData({ step: batch?.state as TransferModalDataStep }));
      }
    }
  };

  const handleOpenModal = () => {
    if (!batch?.state) return;
    handleStateChange(); 
    openBatchModal();
  };

  const handleError = (err?: any) => {
    if (err) AppLog.error(`Deposit Error`, err);
    dispatch(modalsSliceActions.closeDepositProgressModal());
    dispatch(modalsSliceActions.clearDepositModalData());
    addNotification({ title: `Deposit ${value} ${selectedToken?.symbol} failed`, type: NotificationType.Error, id: Date.now().toString(), });
    popNotification(id)
  }

  useEffect(handleStateChange, [batchExecutalbe?.activeStep, batch.state]);

  useEffect(() => {
    handleOpenModal();
    if (typeof batchExecutalbe?.execute === 'undefined' || !batch?.state) return;

    if (batchExecutalbe?.execute) {
      batchExecutalbe.execute().then((data: any) => {
        if (data) {
          dispatch(modalsSliceActions.closeDepositProgressModal());
          getBalances();
          addNotification({
            title: `Deposited ${value} ${selectedToken?.symbol}`, type: NotificationType.Success, id: Date.now().toString(), transactionLink: '/activity',
          });
          dispatch(modalsSliceActions.clearDepositModalData());
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
