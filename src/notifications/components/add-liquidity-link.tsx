import { useEffect, useMemo } from 'react';
import { Link } from '@chakra-ui/react';

import { useTotalBalances } from '@/hooks/use-balances';
import { useAddLiquidityBatch } from '@/integrations/transactions';
import {
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useLiquidityViewStore,
  useNotificationStore,
} from '@/store';
import { deserialize, stringify } from '@/utils/format';
import { createCAPLink } from '@/utils/function';

export interface AddLiquidityLinkProps {
  id: string;
}

export const AddLiquidityLink: React.FC<AddLiquidityLinkProps> = ({ id }) => {
  const dispatch = useAppDispatch();
  const liquidityViewStore = useLiquidityViewStore();
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances } = useTotalBalances();

  const { token0, token1, slippage } = useMemo(() => {
    // Clone current state just for this batch
    const { token0, token1, slippage } = liquidityViewStore;

    return deserialize(stringify({ token0, token1, slippage }));
  }, []);

  const [addLiquidityBatch, openAddLiquidityModal] = useAddLiquidityBatch({
    token0,
    token1,
    slippage: Number(slippage),
  });

  const handleStateChange = () => {
    switch (addLiquidityBatch.state) {
      case 'approve':
      case 'deposit':
        dispatch(modalsSliceActions.setAddLiquidityData({ step: 'deposit' }));
        break;
      case 'addLiquidity':
        dispatch(
          modalsSliceActions.setAddLiquidityData({ step: 'addLiquidity' })
        );
        break;
    }
  };

  const handleOpenModal = () => {
    handleStateChange();
    openAddLiquidityModal();
    dispatch(modalsSliceActions.openAddLiquidityProgressModal());
  };

  useEffect(handleStateChange, [addLiquidityBatch.state]);

  useEffect(() => {
    addLiquidityBatch
      .execute()
      .then((res) => {
        console.log('Add Liquidity Completed', res);
        dispatch(modalsSliceActions.clearAddLiquidityData());
        addNotification({
          title: `Successfuly added liquidity: ${token0.value} ${token0.token?.symbol} + ${token1.value} ${token1.token?.symbol}`,
          type: NotificationType.Done,
          id: Date.now().toString(),
          // TODO: add transaction id
          transactionLink: createCAPLink('transactionId'),
        });
        getBalances();
      })
      .catch((err) => {
        console.error('Add Liquidity Error', err);
        dispatch(modalsSliceActions.clearAddLiquidityData());
        addNotification({
          title: `Failed add liquidity ${token0.value} ${token0.token?.symbol} + ${token1.value} ${token1.token?.symbol}`,
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
