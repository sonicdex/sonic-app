import { useTotalBalances } from '@/hooks/use-balances';
import { useSwapBatch } from '@/integrations/transactions';
import { Modals } from '@/components/modals';
import {
  NotificationType,
  useModalsStore,
  useNotificationStore,
  usePlugStore,
  useSwapViewStore,
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
  const { setCurrentModal, clearModal, setCurrentModalState } =
    useModalsStore();
  const swapViewStore = useSwapViewStore();
  const { addNotification, popNotification } = useNotificationStore();
  const { principalId } = usePlugStore();
  const { getBalances } = useTotalBalances();

  const { from, to, slippage, keepInSonic } = useMemo(() => {
    // Clone current state just for this batch
    const { from, to, slippage, keepInSonic } = swapViewStore;

    return deserialize(stringify({ from, to, slippage, keepInSonic }));
  }, []);

  const handleStateChange = () => {
    switch (swapBatch.state) {
      case 'approve':
      case 'deposit':
        setCurrentModalState('deposit');
        break;
      case 'swap':
        setCurrentModalState('swap');
        break;
      case 'withdraw':
        setCurrentModalState('withdraw');
        break;
    }
  };

  const handleOpenModal = () => {
    handleStateChange();
    openSwapModal();
    setCurrentModal(Modals.SwapProgress);
  };

  const [swapBatch, openSwapModal] = useSwapBatch({
    from,
    to,
    slippage: Number(slippage),
    keepInSonic,
    principalId,
  });

  useEffect(handleStateChange, [swapBatch.state]);

  useEffect(() => {
    swapBatch
      .execute()
      .then((res) => {
        console.log('Remove liqudity Completed', res);
        clearModal();
        addNotification({
          title: `Successfuly removed liquidity: ${from.value} ${from.token?.symbol} + ${to.value} ${to.token?.symbol}`,
          type: NotificationType.Done,
          id: Date.now().toString(),
          // TODO: add transaction id
          transactionLink: createCAPLink('transactionId'),
        });
        getBalances();
      })
      .catch((err) => {
        console.error('Remove liqudity Error', err);
        clearModal();
        addNotification({
          title: `Remove liquidity failed - ${from.value} ${from.token?.symbol} + ${to.value} ${to.token?.symbol}`,
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
