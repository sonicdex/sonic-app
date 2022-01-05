import { Link } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';

import { useBalances } from '@/hooks/use-balances';
import { useSwapBatch } from '@/integrations/transactions';
import {
  modalsSliceActions,
  NotificationType,
  SwapModalDataStep,
  useAppDispatch,
  useNotificationStore,
  usePlugStore,
  useSwapViewStore,
} from '@/store';
import { deserialize, stringify } from '@/utils/format';

export interface SwapLinkProps {
  id: string;
}

export const SwapLink: React.FC<SwapLinkProps> = ({ id }) => {
  const dispatch = useAppDispatch();
  const swapViewStore = useSwapViewStore();
  const { addNotification, popNotification } = useNotificationStore();
  const { principalId } = usePlugStore();
  const { getBalances } = useBalances();

  const { from, to, slippage, keepInSonic } = useMemo(() => {
    // Clone current state just for this batch
    const { from, to, slippage, keepInSonic } = swapViewStore;

    return deserialize(stringify({ from, to, slippage, keepInSonic }));
  }, []);

  const [batch, openSwapModal] = useSwapBatch({
    from,
    to,
    slippage: Number(slippage),
    keepInSonic,
    principalId,
  });

  const handleStateChange = () => {
    if (
      Object.values(SwapModalDataStep).includes(
        batch.state as SwapModalDataStep
      )
    ) {
      dispatch(
        modalsSliceActions.setSwapModalData({
          step: batch.state as SwapModalDataStep,
        })
      );
    }
  };

  const handleOpenModal = () => {
    handleStateChange();
    openSwapModal();
  };

  useEffect(handleStateChange, [batch.state]);

  useEffect(() => {
    batch
      .execute()
      .then(() => {
        dispatch(modalsSliceActions.clearSwapModalData());
        dispatch(modalsSliceActions.closeSwapProgressModal());

        addNotification({
          title: `Swapped ${from.value} ${from.metadata.symbol} for ${to.value} ${to.metadata.symbol}`,
          type: NotificationType.Success,
          id: Date.now().toString(),
          transactionLink: '/activity',
        });
        getBalances();
      })
      .catch((err) => {
        console.error('Swap Error', err);
        dispatch(modalsSliceActions.clearSwapModalData());

        addNotification({
          title: `Failed swapping ${from.value} ${from.metadata.symbol} for ${to.value} ${to.metadata.symbol}`,
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
