import { Link } from '@chakra-ui/react';
import { deserialize, serialize } from '@sonicdex/sonic-js';
import { useEffect, useMemo } from 'react';
import { useBalances } from '@/hooks/use-balances';

import { useTransferBatch } from '@/integrations/transactions';

import {
  TransferModalDataStep, modalsSliceActions, useAppDispatch, useTransferViewStore, NotificationType, useNotificationStore,transferViewActions
} from '@/store';

import { tokenList, AppLog } from '@/utils';

export interface TransferNotificationContentProps { id: string }

export const TransferNotificationContent: React.FC<TransferNotificationContentProps> = ({ id }) => {
  const dispatch = useAppDispatch();

  const { addNotification, popNotification } = useNotificationStore(), { getBalances } = useBalances();
  const transferViewStore = useTransferViewStore();
  //getBalances()
  const { value, tokenId } = useMemo(() => {
    const { amount: value, tokenId  } = transferViewStore;
    return deserialize(serialize({ value, tokenId }));
  }, []) ?? {};

  const selectedToken = tokenList('obj', tokenId);

  const toAddress= transferViewStore.toAddress;

  const addressType = transferViewStore.addressType;

  var batchData = useTransferBatch({ amount: value, token: selectedToken, address:toAddress , addressType:addressType});

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
    if (err) AppLog.error(`Transfer Error`, err);
    dispatch(modalsSliceActions.closeTransferProgressModal());
    dispatch(modalsSliceActions.clearTransferModalData() );
    addNotification({ title: `Transfer ${value} ${selectedToken?.symbol} failed`, type: NotificationType.Error, id: Date.now().toString(), });
    popNotification(id)
  }

  useEffect(handleStateChange, [batchExecutalbe?.activeStep, batch.state]);

  useEffect(() => {
    handleOpenModal();
    if (typeof batchExecutalbe?.execute === 'undefined' || !batch?.state) return;

    if (batchExecutalbe?.execute) {

      console.log(batchExecutalbe);
      
      batchExecutalbe.execute().then((data: any) => {
        if (data) {
          dispatch(transferViewActions.setToAddress(''));
          dispatch(modalsSliceActions.closeTransferProgressModal());
          getBalances();
          addNotification({
            title: `Transfered ${value} ${selectedToken?.symbol}`, type: NotificationType.Success, id: Date.now().toString(), transactionLink: '',
          });
          dispatch(modalsSliceActions.clearTransferModalData());
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
