import { Link } from '@chakra-ui/react';
import { deserialize, serialize } from '@memecake/sonic-js';
import { useEffect, useMemo } from 'react';

import { useTokenAllowance } from '@/hooks';
import { useBalances } from '@/hooks/use-balances';
import { useSwapBatch } from '@/integrations/transactions';
import {
  modalsSliceActions, NotificationType, SwapModalDataStep, useAppDispatch,
  useNotificationStore, usePlugStore,useSwapViewStore,
} from '@/store';

export interface SwapNotificationContentProps {
  id: string;
}

export const SwapNotificationContent: React.FC<SwapNotificationContentProps> = ({ id }) => {

  const dispatch = useAppDispatch();
  const swapViewStore = useSwapViewStore();
  const { addNotification, popNotification } = useNotificationStore();
  const { principalId } = usePlugStore();
  const { getBalances } = useBalances();
  // const { getAllPairs } = useAllPairs();
 
  const { from, to, slippage, keepInSonic } =
    useMemo(() => {
      // Clone current state just for this batch
      const { from, to, slippage, keepInSonic } = swapViewStore;

      return deserialize(serialize({ from, to, slippage, keepInSonic }));
    }, []) ?? {};

  const allowance = useTokenAllowance(from.metadata?.id);
  var batchData = useSwapBatch({ from, to, slippage: Number(slippage), keepInSonic, principalId, allowance });

  const batch: any = batchData?.batch, openBatchModal: any = batchData?.openBatchModal;
  const batchFnUpdate = batch?.batchFnUpdate;

  const handleStateChange = () => {
    if (batch && batch.state)
    if (Object.values(SwapModalDataStep).includes(batch.state as SwapModalDataStep)){
      dispatch( modalsSliceActions.setSwapModalData({ step: batch.state as SwapModalDataStep}));
    }
  };

  const handleOpenModal = () => {
    if (!batch?.state && from.metadata?.symbol) return;
    if (typeof allowance === 'number') {
      dispatch(modalsSliceActions.closeAllowanceVerifyModal());
      handleStateChange();
      openBatchModal();
    } else {
      dispatch( modalsSliceActions.setAllowanceVerifyModalData({ tokenSymbol: from.metadata?.symbol}));
      dispatch(modalsSliceActions.openAllowanceVerifyModal());
    }
  };

  useEffect(handleStateChange, [batch.state, dispatch]);

  useEffect(() => {
    handleOpenModal();
    if (typeof allowance === 'undefined') return;
    if (batch.execute)
      batch.execute().then(() => {
        dispatch(modalsSliceActions.clearSwapModalData());
        dispatch(modalsSliceActions.closeSwapProgressModal());
        getBalances();
        addNotification({
          title: `Swapped ${from.value} ${from.metadata.symbol} for ${to.value} ${to.metadata.symbol}`,
          type: NotificationType.Success, id: Date.now().toString(), transactionLink: '/activity',
        });
        
        // getAllPairs();
      }).catch((err: any) => {

        dispatch(modalsSliceActions.clearSwapModalData());
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
      }).finally(() => popNotification(id));
  }, [ batchFnUpdate]);

  return (
    <Link target="_blank" rel="noreferrer" color="dark-blue.500" onClick={handleOpenModal}>
      View progress
    </Link>
  );
};
