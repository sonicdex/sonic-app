import { useBalances } from '@/hooks/use-balances';
import { useRemoveLiquidityBatch } from '@/integrations/transactions';

import {
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useLiquidityViewStore,
  useNotificationStore,
  usePlugStore,
  useSwapCanisterStore,
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
  const { userLPBalances } = useSwapCanisterStore();
  const { addNotification, popNotification } = useNotificationStore();
  const { principalId } = usePlugStore();
  const { getBalances } = useBalances();

  const { token0, token1, slippage, keepInSonic } = useMemo(() => {
    const { token0, token1, slippage, keepInSonic, removeAmountPercentage } =
      liquidityViewStore;
    if (userLPBalances && token0.metadata && token1.metadata) {
      const tokensLPBalance =
        userLPBalances[token0.metadata.id]?.[token1.metadata.id];
      const lpAmount = (removeAmountPercentage / 100) * tokensLPBalance;

      return deserialize(
        stringify({ token0, token1, slippage, keepInSonic, lpAmount })
      );
    }

    return {};
  }, [liquidityViewStore, userLPBalances]);

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
        dispatch(modalsSliceActions.closeRemoveLiquidityProgressModal());
        addNotification({
          title: `Successfuly removed liquidity: ${token0.value} ${token0.metadata.symbol} + ${token1.value} ${token1.metadata.symbol}`,
          type: NotificationType.Success,
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
          title: `Remove liquidity failed - ${token0.value} ${token0.metadata.symbol} + ${token1.value} ${token1.metadata.symbol}`,
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
