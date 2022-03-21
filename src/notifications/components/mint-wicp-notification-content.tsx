import { Link } from '@chakra-ui/react';
import { deserialize, serialize } from '@psychedelic/sonic-js';
import { useEffect, useMemo } from 'react';

import { useBalances } from '@/hooks/use-balances';
import { useMintBatch } from '@/integrations/transactions';
import {
  MintModalDataStep,
  MintTokenSymbol,
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useNotificationStore,
  useSwapViewStore,
} from '@/store';

export interface MintWICPNotificationContentProps {
  id: string;
}

export const MintWICPNotificationContent: React.FC<
  MintWICPNotificationContentProps
> = ({ id }) => {
  const dispatch = useAppDispatch();
  const swapViewStore = useSwapViewStore();
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances } = useBalances();

  const { from, to, keepInSonic } =
    useMemo(() => {
      const { from, to, keepInSonic } = swapViewStore;

      return deserialize(serialize({ from, to, keepInSonic }));
    }, []) ?? {};

  const { batch, openBatchModal } = useMintBatch({
    amountIn: from.value,
    amountOut: to.value,
    tokenSymbol: MintTokenSymbol.WICP,
    keepInSonic,
  });

  const handleStateChange = () => {
    if (
      Object.values(MintModalDataStep).includes(
        batch.state as MintModalDataStep
      )
    ) {
      dispatch(
        modalsSliceActions.setMintWICPModalData({
          step: batch.state,
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
        dispatch(modalsSliceActions.closeMintWICPProgressModal());

        addNotification({
          title: `Wrapped ${from.value} ${from.metadata.symbol}`,
          type: NotificationType.Success,
          id: Date.now().toString(),
          transactionLink: '/activity',
        });
        getBalances();
      })
      .catch((err) => {
        console.error('Wrap Error', err);

        addNotification({
          title: `Wrap ${from.value} ${from.metadata.symbol} failed`,
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
