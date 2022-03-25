import { Link } from '@chakra-ui/react';
import { deserialize, serialize, toBigNumber } from '@psychedelic/sonic-js';
import BigNumber from 'bignumber.js';
import { useEffect, useMemo } from 'react';

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

export interface RemoveLiquidityNotificationContentProps {
  id: string;
}

export const RemoveLiquidityNotificationContent: React.FC<
  RemoveLiquidityNotificationContentProps
> = ({ id }) => {
  const dispatch = useAppDispatch();
  const liquidityViewStore = useLiquidityViewStore();
  const { userLPBalances } = useSwapCanisterStore();
  const { addNotification, popNotification } = useNotificationStore();
  const { principalId } = usePlugStore();
  const { getBalances, getUserPositiveLPBalances } = useBalances();

  const { token0, token1, ...removeLiquidityBatchParams } =
    useMemo(() => {
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

        const amount0Min = toBigNumber(
          amount0Desired
            .minus(amount0Desired.multipliedBy(Number(slippage)))
            .toString()
        ).applyDecimals(token0.metadata.decimals);

        const amount1Min = toBigNumber(
          amount1Desired
            .minus(amount1Desired.multipliedBy(Number(slippage)))
            .toString()
        ).applyDecimals(token1.metadata.decimals);

        return deserialize(
          serialize({
            token0,
            token1,
            keepInSonic,
            lpAmount,
            amount0Min,
            amount1Min,
          })
        );
      }
    }, []) ?? {};

  const { batch, openBatchModal } = useRemoveLiquidityBatch({
    token0,
    token1,
    principalId,
    ...removeLiquidityBatchParams,
    // TODO: Improve safety
  } as any);

  const handleStateChange = () => {
    if (
      Object.values(RemoveLiquidityModalDataStep).includes(
        batch.state as RemoveLiquidityModalDataStep
      )
    ) {
      dispatch(
        modalsSliceActions.setRemoveLiquidityModalData({
          step: batch.state as RemoveLiquidityModalDataStep,
        })
      );
    }
  };

  const handleOpenModal = () => {
    handleStateChange();

    openBatchModal();
  };

  useEffect(handleStateChange, [batch.state, dispatch]);

  useEffect(() => {
    batch
      .execute()
      .then(() => {
        dispatch(modalsSliceActions.clearRemoveLiquidityModalData());
        dispatch(modalsSliceActions.closeRemoveLiquidityProgressModal());
        addNotification({
          title: `Removed LP of ${token0.value} ${token0.metadata.symbol} + ${token1.value} ${token1.metadata.symbol}`,
          type: NotificationType.Success,
          id: Date.now().toString(),
          transactionLink: '/activity',
        });
        getBalances();
        getUserPositiveLPBalances();
      })
      .catch((err) => {
        console.error('Remove liqudity Error', err);
        dispatch(modalsSliceActions.clearRemoveLiquidityModalData());
        addNotification({
          title: `Remove LP of ${token0.value} ${token0.metadata.symbol} + ${token1.value} ${token1.metadata.symbol} failed`,
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
      color="dark-blue.500"
      onClick={handleOpenModal}
    >
      View progress
    </Link>
  );
};