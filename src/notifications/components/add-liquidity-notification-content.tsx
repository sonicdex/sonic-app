import { Link } from '@chakra-ui/react';
import { deserialize, serialize } from '@memecake/sonic-js';
import { useEffect, useMemo } from 'react';

import { useAllPairs } from '@/hooks';
import { useBalances } from '@/hooks/use-balances';
import { useTokenAllowance } from '@/hooks/use-token-allowance';
import { useAddLiquidityBatch } from '@/integrations/transactions';
import {
  AddLiquidityModalDataStep, modalsSliceActions, NotificationType,
  useAppDispatch, useLiquidityViewStore, useNotificationStore,
} from '@/store';

import { AppLog } from '@/utils';

export interface AddLiquidityNotificationContentProps {
  id: string;
}

export const AddLiquidityNotificationContent: React.FC<
  AddLiquidityNotificationContentProps
> = ({ id }) => {
  const dispatch = useAppDispatch();
  const liquidityViewStore = useLiquidityViewStore();
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances, getUserPositiveLPBalances } = useBalances();
  const { getAllPairs } = useAllPairs();

  const { token0, token1, slippage } =
    useMemo(() => {
      // Clone current state just for this batch
      const { token0, token1, slippage, pair } = liquidityViewStore;
      // Is needed to send to canister the values in the pair id order
      if (pair) {
        const token0Id = pair.id.split(':')[0];
        if (token0Id !== token0.metadata?.id) {
          return deserialize(
            serialize({ token0: token1, token1: token0, slippage })
          );
        }
      }
      return deserialize(serialize({ token0, token1, slippage }));
    }, []) ?? {};

    
  const allowance0 = useTokenAllowance(token0.metadata?.id);
  const allowance1 = useTokenAllowance(token1.metadata?.id);

  var batchData = useAddLiquidityBatch({ token0, token1, slippage: Number(slippage) });

  const batch: any = batchData?.batch, openBatchModal: any = batchData?.openBatchModal;
  const batchFnUpdate = batch?.batchFnUpdate;

  const handleStateChange = () => {
    if (batch && batch.state)
    if (Object.values(AddLiquidityModalDataStep).includes(batch.state as AddLiquidityModalDataStep)){
      dispatch(modalsSliceActions.setAddLiquidityModalData({ step: batch.state as AddLiquidityModalDataStep 
    }));
    }
  };

  const handleOpenModal = () => {
    if (!batch?.state) return;
    if (typeof allowance0 === 'number' && typeof allowance1 === 'number') {
      dispatch(modalsSliceActions.closeAllowanceVerifyModal());
      handleStateChange();
      openBatchModal();
    } else {
      dispatch( 
        modalsSliceActions.setAllowanceVerifyModalData({
          tokenSymbol: [token0.metadata?.symbol, token1.metadata?.symbol],
        })
      );
      dispatch(modalsSliceActions.openAllowanceVerifyModal());
    }
  };
  useEffect(handleStateChange, [batch.state, dispatch]);
  useEffect(() => {
    handleOpenModal();
    if (typeof allowance0 === 'undefined' || typeof allowance1 === 'undefined')
      return;
    if (batch.execute)
    batch.execute().then(() => {
      dispatch(modalsSliceActions.clearAddLiquidityModalData());
      dispatch(modalsSliceActions.closeAddLiquidityProgressModal());

      addNotification({
        title: `Added LP of ${token0.value} ${token0.metadata.symbol} + ${token1.value} ${token1.metadata.symbol}`,
        type: NotificationType.Success,id: Date.now().toString(),transactionLink: '/activity',
      });
      getBalances();
      getAllPairs();
      
      getUserPositiveLPBalances();
      

    }).catch((err:any) => {
      AppLog.error('Add Liquidity Error', err);
      dispatch(modalsSliceActions.clearAddLiquidityModalData());
      addNotification({
        title: `Add LP of ${token0.value} ${token0.metadata.symbol} + ${token1.value} ${token1.metadata.symbol} failed`,
        type: NotificationType.Error, id: Date.now().toString(),
      });
    }).finally(() => popNotification(id));
  }, [batchFnUpdate]);
  return (
    <Link target="_blank" rel="noreferrer" color="dark-blue.500" onClick={handleOpenModal}>
      View progress
    </Link>
  );
};
