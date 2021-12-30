import { useBalances } from '@/hooks/use-balances';
import { useRemoveLiquidityBatch } from '@/integrations/transactions';

import {
  modalsSliceActions,
  NotificationType,
  RemoveLiquidityModalDataStep,
  useAppDispatch,
  useLiquidityViewStore,
  useNotificationStore,
  usePlugStore,
  useSwapCanisterStore,
} from '@/store';
import { deserialize, getCurrency, stringify } from '@/utils/format';
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
  const { getBalances, getUserPositiveLPBalances } = useBalances();

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

      const amount0Desired = new BigNumber(lpAmount)
        .multipliedBy(pair.reserve0.toString())
        .dividedBy(pair.totalSupply.toString())
        .multipliedBy(removeAmountPercentage / 100)
        .multipliedBy(Number(slippage));

      const amount1Desired = new BigNumber(lpAmount)
        .multipliedBy(pair.reserve1.toString())
        .dividedBy(pair.totalSupply.toString())
        .multipliedBy(removeAmountPercentage / 100)
        .multipliedBy(Number(slippage));

      const amount0Min = getCurrency(
        amount0Desired
          .minus(amount0Desired.multipliedBy(Number(slippage)))
          .toString(),
        token0.metadata.decimals
      );

      const amount1Min = getCurrency(
        amount1Desired
          .minus(amount1Desired.multipliedBy(Number(slippage)))
          .toString(),
        token1.metadata.decimals
      );

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
  }, [
    liquidityViewStore.token0.metadata,
    liquidityViewStore.token1.metadata,
    userLPBalances,
  ]);

  const [batch, openRemoveLiquidityModal] = useRemoveLiquidityBatch({
    token0,
    token1,
    principalId,
    ...removeLiquidityBatchParams,
  });

  const handleStateChange = () => {
    if (batch.state in RemoveLiquidityModalDataStep) {
      dispatch(
        modalsSliceActions.setRemoveLiquidityModalData({
          step: batch.state as RemoveLiquidityModalDataStep,
        })
      );
    }
  };

  const handleOpenModal = () => {
    handleStateChange();
    openRemoveLiquidityModal();
  };

  useEffect(handleStateChange, [batch.state]);

  useEffect(() => {
    batch
      .execute()
      .then((res) => {
        dispatch(modalsSliceActions.clearRemoveLiquidityModalData());
        dispatch(modalsSliceActions.closeRemoveLiquidityProgressModal());
        addNotification({
          title: `Successfuly removed liquidity: ${token0.value} ${token0.metadata.symbol} + ${token1.value} ${token1.metadata.symbol}`,
          type: NotificationType.Success,
          id: Date.now().toString(),
          // TODO: add transaction id
          transactionLink: createCAPLink('transactionId'),
        });
        getBalances();
        getUserPositiveLPBalances();
      })
      .catch((err) => {
        console.error('Remove liqudity Error', err);
        dispatch(modalsSliceActions.clearRemoveLiquidityModalData());
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
