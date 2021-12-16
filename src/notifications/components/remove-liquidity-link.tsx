import { useTotalBalances } from '@/hooks/use-balances';
import { useRemoveLiquidityBatch } from '@/integrations/transactions';

import {
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useLiquidityViewStore,
  useNotificationStore,
  usePlugStore,
} from '@/store';
import { deserialize, stringify } from '@/utils/format';
import { createCAPLink } from '@/utils/function';
import { Link } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';

export interface RemoveLiquidityLinkProps {
  id: string;
}

export const RemoveLiquidityLink: React.FC<RemoveLiquidityLinkProps> = ({
  id,
}) => {
  const dispatch = useAppDispatch();
  const liquidityViewStore = useLiquidityViewStore();
  const { addNotification, popNotification } = useNotificationStore();
  const { principalId } = usePlugStore();
  const { getBalances } = useTotalBalances();

  const { token0, token1, slippage, keepInSonic } = useMemo(() => {
    // Clone current state just for this batch
    const { token0, token1, slippage, keepInSonic } = liquidityViewStore;

    return deserialize(stringify({ token0, token1, slippage, keepInSonic }));
  }, []);

  const handleStateChange = () => {
    switch (removeLiquidityBatch.state) {
      case 'removeLiquidity':
        dispatch(
          modalsSliceActions.setRemoveLiquidityData({
            step: 'removeLiquidity',
          })
        );
        break;
      case 'withdraw':
        dispatch(
          modalsSliceActions.setRemoveLiquidityData({
            step: 'withdraw',
          })
        );
        break;
    }
  };

  const handleOpenModal = () => {
    handleStateChange();
    openSwapModal();
    dispatch(modalsSliceActions.openRemoveLiquidityProgressModal());
  };

  const [removeLiquidityBatch, openSwapModal] = useRemoveLiquidityBatch({
    token0,
    token1,
    lpAmount: 0, // TODO: get lpAmount from store
    slippage: Number(slippage),
    keepInSonic,
    principalId,
  });

  useEffect(handleStateChange, [removeLiquidityBatch.state]);

  useEffect(() => {
    removeLiquidityBatch
      .execute()
      .then((res) => {
        console.log('Remove liqudity Completed', res);
        dispatch(modalsSliceActions.clearRemoveLiquidityData());
        addNotification({
          title: `Successfuly removed liquidity: ${token0.value} ${token0.token?.symbol} + ${token1.value} ${token1.token?.symbol}`,
          type: NotificationType.Done,
          id: Date.now().toString(),
          // TODO: add transaction id
          transactionLink: createCAPLink('transactionId'),
        });
        getBalances();
      })
      .catch((err) => {
        console.error('Remove liqudity Error', err);
        dispatch(modalsSliceActions.clearRemoveLiquidityData());
        addNotification({
          title: `Remove liquidity failed - ${token0.value} ${token0.token?.symbol} + ${token1.value} ${token1.token?.symbol}`,
          type: NotificationType.Error,
          id: Date.now().toString(),
        });
      })
      .finally(() => popNotification(id));

    handleOpenModal();
  }, []);

  return (
    <Link
      target="_blank"
      rel="noreferrer"
      color="#3D52F4"
      onClick={handleOpenModal}
    >
      View progress
    </Link>
  );
};
