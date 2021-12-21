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
import BigNumber from 'bignumber.js';
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

  const { token0, token1, ...removeLiquidityBatchParams } = useMemo(() => {
    const {
      token0,
      token1,
      slippage,
      keepInSonic,
      removeAmountPercentage,
      pair,
    } = liquidityViewStore;

    if (userLPBalances && token0.metadata && token1.metadata && pair) {
      const tokensLPBalance =
        userLPBalances[token0.metadata.id]?.[token1.metadata.id];
      const lpAmount = (removeAmountPercentage / 100) * tokensLPBalance;

      const amount0Desired = new BigNumber(pair.reserve0.toString())
        .dividedBy(pair.reserve1.toString())
        .multipliedBy(lpAmount)
        .multipliedBy(removeAmountPercentage / 100)
        .multipliedBy(Number(slippage));

      const amount1Desired = new BigNumber(pair.reserve1.toString())
        .dividedBy(pair.reserve0.toString())
        .multipliedBy(lpAmount)
        .multipliedBy(removeAmountPercentage / 100)
        .multipliedBy(Number(slippage));

      const amount0Min = amount0Desired
        .minus(amount0Desired.multipliedBy(Number(slippage)))
        .toString();
      const amount1Min = amount1Desired
        .minus(amount1Desired.multipliedBy(Number(slippage)))
        .toString();

      return deserialize(
        stringify({
          token0,
          token1,
          keepInSonic,
          lpAmount,
          amount0Min,
          amount1Min,
        })
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
      case 'withdraw0':
        dispatch(
          modalsSliceActions.setRemoveLiquidityData({
            step: 'withdraw0',
          })
        );
        break;
      case 'withdraw1':
        dispatch(
          modalsSliceActions.setRemoveLiquidityData({
            step: 'withdraw1',
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
    principalId,
    ...removeLiquidityBatchParams,
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
