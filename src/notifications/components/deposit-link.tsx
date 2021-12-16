import { useTotalBalances } from '@/hooks/use-balances';
import { useDepositBatch, useSwapBatch } from '@/integrations/transactions';
import { MODALS } from '@/modals';
import {
  NotificationType,
  useAssetsViewStore,
  useModalStore,
  useNotificationStore,
  usePlugStore,
  useSwapViewStore,
} from '@/store';
import { deserialize, stringify } from '@/utils/format';
import { createCAPLink } from '@/utils/function';
import { Link } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';

export interface SwapLinkProps {
  id: string;
}

export const SwapLink: React.FC<SwapLinkProps> = ({ id }) => {
  const { setCurrentModal, clearModal, setCurrentModalState } = useModalStore();
  const assetsViewStore = useAssetsViewStore();
  const { addNotification, popNotification } = useNotificationStore();
  const { principalId } = usePlugStore();
  const { getBalances } = useTotalBalances();

  const { from, to, slippage, keepInSonic } = useMemo(() => {
    // Clone current state just for this batch
    const { depositValue, de } = assetsViewStore;

    return deserialize(stringify({ from, to, slippage, keepInSonic }));
  }, []);

  const {} = useDepositBatch();

  const handleStateChange = () => {
    switch (swapBatch.state) {
      case 'approve':
        setCurrentModalState('approve');
        break;
      case 'deposit':
        setCurrentModalState('deposit');
        break;
    }
  };

  const handleDeposit = async () => {
    try {
      await depositBatch.execute();

      addNotification({
        title: 'Deposit successful',
        type: NotificationType.Done,
        id: Date.now().toString(),
      });

      getBalances();
    } catch (error) {
      addNotification({
        title: `Deposit failed ${depositValue} ${selectedToken?.symbol}`,
        type: NotificationType.Error,
        id: Date.now().toString(),
      });
    }
  };

  const handleOpenModal = () => {
    handleStateChange();
    openSwapModal();
    setCurrentModal(MODALS.swapProgress);
  };

  useEffect(handleStateChange, [swapBatch.state]);

  useEffect(() => {
    swapBatch
      .execute()
      .then((res) => {
        console.log('Swap Completed', res);
        clearModal();
        addNotification({
          title: `Swapped ${from.value} ${from.token?.symbol} for ${to.value} ${to.token?.symbol}`,
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
          title: `Failed swapping ${from.value} ${from.token?.symbol} for ${to.value} ${to.token?.symbol}`,
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
