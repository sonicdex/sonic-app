import { Link } from '@chakra-ui/react';
import { deserialize, serialize } from '@sonicdex/sonic-js';
import { useEffect, useMemo } from 'react';

import { useBalances } from '@/hooks/use-balances';
import { useMintBatch } from '@/integrations/transactions';
import {
  MintModalDataStep, MintTokenSymbol, modalsSliceActions, NotificationType,
  useAppDispatch, useNotificationStore, useSwapViewStore,
} from '@/store';
import { AppLog } from '@/utils';

export interface MintWICPNotificationContentProps {
  id: string;
}

export const MintWICPNotificationContent: React.FC<
  MintWICPNotificationContentProps
> = ({ id }) => {
  const dispatch = useAppDispatch();
  const swapViewStore = useSwapViewStore();
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances } = useBalances();

  const { from, to, keepInSonic } = useMemo(() => {
    const { from, to, keepInSonic } = swapViewStore;
    return deserialize(serialize({ from, to, keepInSonic }));
  }, []) ?? {};

  const batchData = useMintBatch({ amountIn: from.value, amountOut: to.value, tokenSymbol: MintTokenSymbol.WICP, keepInSonic });
  const batch = batchData?.batch, openBatchModal = batchData?.openBatchModal;
  const batchExecutalbe = batch?.batchExecute;
  const batchFnUpdate = batch.batchFnUpdate;

  const handleStateChange = () => {
    if (!batch?.state) return;
    if (batch?.state && batchExecutalbe?.state == "running") {
      batch.state = batchExecutalbe.activeStep;
    } else if (batch?.state == 'error') {
      handleError();
    }
    if (batch?.state) {
      if (Object.values(MintModalDataStep).includes(batch?.state as MintModalDataStep)) {
        dispatch(modalsSliceActions.setMintWICPModalData({ step: batch?.state }));
      }
    }
  };
  const handleOpenModal = () => {
    handleStateChange();
    openBatchModal();
  };

  const handleError = (err?: any) => {
    if (err) AppLog.error('Mint WICP Error', err);
    dispatch(modalsSliceActions.closeMintWICPProgressModal());
    addNotification({
      title: `Wrap ${from.value} ${from.metadata.symbol} failed`, type: NotificationType.Error, id: Date.now().toString(),
    });
    popNotification(id);
  };

  useEffect(handleStateChange, [batchExecutalbe?.activeStep, batch.state]);

  useEffect(() => {
    handleOpenModal();
    if (batchExecutalbe?.execute) {
      batchExecutalbe.execute().then((data: any) => {
        if (data) {
          dispatch(modalsSliceActions.closeMintWICPProgressModal());
          addNotification({ title: `Wrapped ${from.value} ${from.metadata.symbol}`, type: NotificationType.Success, id: Date.now().toString(), transactionLink: '/activity' });
          getBalances();
        } else handleError();
       }).catch((err: any) => handleError(err)).finally(() => popNotification(id));
    }
    if(batchFnUpdate=='error') handleError();
  }, [batchFnUpdate]);

  return (
    <Link target="_blank" rel="noreferrer" color="green.500" onClick={handleOpenModal}>View progress</Link>
  );
};
