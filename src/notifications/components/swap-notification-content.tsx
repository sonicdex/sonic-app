import { Link } from '@chakra-ui/react';
import { deserialize, serialize } from '@sonicdex/sonic-js';
import { useEffect, useMemo } from 'react';

import { useTokenAllowance } from '@/hooks';
import { useBalances } from '@/hooks/use-balances';
import { useSwapBatch } from '@/integrations/transactions';
import {
  modalsSliceActions, NotificationType, SwapModalDataStep, useAppDispatch,
  useNotificationStore, useWalletStore, useSwapViewStore,
} from '@/store';

export interface SwapNotificationContentProps {
  id: string;
}

export const SwapNotificationContent: React.FC<SwapNotificationContentProps> = ({ id }) => {

  const dispatch = useAppDispatch();
  const swapViewStore = useSwapViewStore();
  const { addNotification, popNotification } = useNotificationStore();
  const { principalId } = useWalletStore();
  const { getBalances } = useBalances();
  // const { getAllPairs } = useAllPairs();

  const { from, to, slippage, keepInSonic } = useMemo(() => {
    const { from, to, slippage, keepInSonic } = swapViewStore;
    return deserialize(serialize({ from, to, slippage, keepInSonic }));
  }, []) ?? {};

  const allowance = useTokenAllowance(from.metadata?.id);
  var batchData = useSwapBatch({ from, to, slippage: Number(slippage), keepInSonic, principalId, allowance });

  const batch = batchData?.batch, openBatchModal = batchData?.openBatchModal;
  const batchExecutalbe = batch?.batchExecute;
  const batchFnUpdate = batch.batchFnUpdate;

  const handleStateChange = () => {
    if (!batch?.state) return;
    if (batch?.state && batchExecutalbe?.state == "running") batch.state = batchExecutalbe.activeStep;
    else if (batch?.state == 'error') { handleError() }
    if (batch?.state) {
      if (Object.values(SwapModalDataStep).includes(batch?.state as SwapModalDataStep)) {
        dispatch(modalsSliceActions.setSwapModalData({ step: batch?.state as SwapModalDataStep }));
      }
    }
  };

  const handleOpenModal = () => {
    if (!batch?.state && from.metadata?.symbol || !openBatchModal) return;
    if (typeof allowance === 'number') {
      dispatch(modalsSliceActions.closeAllowanceVerifyModal());
      handleStateChange();
      openBatchModal();
    } else {
      dispatch(modalsSliceActions.setAllowanceVerifyModalData({ tokenSymbol: from.metadata?.symbol }));
      dispatch(modalsSliceActions.openAllowanceVerifyModal());
    }
  };

  const handleError = (err?: any) => {
    if (err){
      if (err.message === 'slippage: insufficient output amount') {
        addNotification({
          title: `Slippage is too low to swap ${from.value} ${from.metadata.symbol} for ${to.value} ${to.metadata.symbol}`,
          type: NotificationType.Error, id: Date.now().toString(),
        });
      } else {
        addNotification({
          title: `Swap ${from.value} ${from.metadata.symbol} for ${to.value} ${to.metadata.symbol} failed`,
          type: NotificationType.Error, id: Date.now().toString(),
        });
      }
    }
    dispatch(modalsSliceActions.clearSwapModalData());
    dispatch(modalsSliceActions.closeSwapProgressModal());
   
    popNotification(id)
  }

  useEffect(handleStateChange, [batchExecutalbe?.activeStep, batch.state]);

  useEffect(() => {
    handleOpenModal();
    if (typeof allowance === 'undefined' || !batch?.state) return;
    if (batchExecutalbe?.execute) {
      batchExecutalbe.execute().then((data: any) => {
        if (data) {
          dispatch(modalsSliceActions.clearSwapModalData());
          dispatch(modalsSliceActions.closeSwapProgressModal());
          addNotification({
            title: `Swapped ${from.value} ${from.metadata.symbol} for ${to.value} ${to.metadata.symbol}`,
            type: NotificationType.Success, id: Date.now().toString(), transactionLink: '/activity',
          });
          getBalances();
        } else handleError();
      }).catch((err: any) => handleError(err)).finally(() => popNotification(id));
    }
  }, [batchFnUpdate]);

  return (
    <Link target="_blank" rel="noreferrer" color="green.500" onClick={handleOpenModal}>
      View progress
    </Link>
  );
};
