import { useEffect, useMemo } from 'react';
import { Link } from '@chakra-ui/react';

import { useBalances } from '@/hooks/use-balances';
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
  const { getBalances, getUserPositiveLPBalances } = useBalances();

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
      case 'createPair':
        dispatch(
          modalsSliceActions.setAddLiquidityData({ step: 'createPair' })
        );
        break;
      case 'approve0':
      case 'deposit0':
        dispatch(modalsSliceActions.setAddLiquidityData({ step: 'deposit0' }));
        break;
      case 'approve1':
      case 'deposit1':
        dispatch(modalsSliceActions.setAddLiquidityData({ step: 'deposit1' }));
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
  };

  useEffect(handleStateChange, [addLiquidityBatch.state]);

  useEffect(() => {
    addLiquidityBatch
      .execute()
      .then((res) => {
        console.log('Add Liquidity Completed', res);
        dispatch(modalsSliceActions.clearAddLiquidityData());
        dispatch(modalsSliceActions.closeAddLiquidityProgressModal());
        addNotification({
          title: `Successfuly added liquidity: ${token0.value} ${token0.metadata.symbol} + ${token1.value} ${token1.metadata.symbol}`,
          type: NotificationType.Success,
          id: Date.now().toString(),
          // TODO: add transaction id
          transactionLink: createCAPLink('transactionId'),
        });
        getBalances();
        getUserPositiveLPBalances();
      })
      .catch((err) => {
        console.error('Add Liquidity Error', err);
        dispatch(modalsSliceActions.clearAddLiquidityData());
        addNotification({
          title: `Failed add liquidity ${token0.value} ${token0.metadata.symbol} + ${token1.value} ${token1.metadata.symbol}`,
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
