import { useTotalBalances } from '@/hooks/use-balances';
import { useSwapBatch } from '@/integrations/transactions';
import { MODALS } from '@/modals';
import {
  NotificationType,
  useModalStore,
  useNotificationStore,
  usePlugStore,
  useSwapViewStore,
} from '@/store';
import { deserialize, stringify } from '@/utils/format';
import { createCAPLink } from '@/utils/function';
import { Box } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';

export interface SwapLinkProps {
  id: string;
}

export const SwapLink: React.FC<SwapLinkProps> = ({ id }) => {
  const {
    setCurrentModal,
    clearModal,
    setCurrentModalState,
    setCurrentModalData,
  } = useModalStore();
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

  const swapBatch = useSwapBatch({
    from,
    to,
    slippage: Number(slippage),
    keepInSonic,
    principalId,
  });

  const handleOpenModal = () => {
    console.log(from.token, to.token);
    handleStateChange();
    setCurrentModalData({
      fromToken: from.token.symbol,
      toToken: to.token.symbol,
    });
    setCurrentModal(MODALS.swapProgress);
  };

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
  }, []);

  useEffect(handleStateChange, [swapBatch.state]);

  return (
    <Box
      as="a"
      target="_blank"
      rel="noreferrer"
      color="#3D52F4"
      onClick={handleOpenModal}
      cursor="pointer"
    >
      View progress
    </Box>
  );
};
