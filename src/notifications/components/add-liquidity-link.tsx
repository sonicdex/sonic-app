import { useEffect, useMemo } from 'react';
import { Link } from '@chakra-ui/react';

import { useTotalBalances } from '@/hooks/use-balances';
import { useAddLiquidityBatch } from '@/integrations/transactions';
import { Modals } from '@/modals';
import {
  NotificationType,
  useLiquidityViewStore,
  useModalStore,
  useNotificationStore,
} from '@/store';
import { deserialize, stringify } from '@/utils/format';
import { createCAPLink } from '@/utils/function';

export interface AddLiquidityLinkProps {
  id: string;
}

export const AddLiquidityLink: React.FC<AddLiquidityLinkProps> = ({ id }) => {
  const { setCurrentModal, clearModal, setCurrentModalState } = useModalStore();
  const liquidityViewStore = useLiquidityViewStore();
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances } = useTotalBalances();

  const { token0, token1, slippage } = useMemo(() => {
    // Clone current state just for this batch
    const { token0, token1, slippage } = liquidityViewStore;

    return deserialize(stringify({ token0, token1, slippage }));
  }, []);

  const handleStateChange = () => {
    switch (swapBatch.state) {
      case 'approve':
      case 'deposit':
        setCurrentModalState('deposit');
        break;
      case 'addLiquidity':
        setCurrentModalState('addLiquidity');
        break;
    }
  };

  const [swapBatch, openAddLiquidityModal] = useAddLiquidityBatch({
    token0,
    token1,
    slippage: Number(slippage),
  });

  const handleOpenModal = () => {
    handleStateChange();
    openAddLiquidityModal();
    setCurrentModal(Modals.SwapProgress);
  };

  useEffect(handleStateChange, [swapBatch.state]);

  useEffect(() => {
    swapBatch
      .execute()
      .then((res) => {
        console.log('Swap Completed', res);
        clearModal();
        addNotification({
          title: `Added liquidity ${token0.value} ${token0.token?.symbol} + ${token1.value} ${token1.token?.symbol}`,
          type: NotificationType.Done,
          id: Date.now().toString(),
          // TODO: add transaction id
          transactionLink: createCAPLink('transactionId'),
        });
        getBalances();
      })
      .catch((err) => {
        console.error('Swap Error', err);
        clearModal();
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
