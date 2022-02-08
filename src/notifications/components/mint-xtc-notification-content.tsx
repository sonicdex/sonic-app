import { Link } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';

import { useBalances } from '@/hooks/use-balances';
import { useMintBatch } from '@/integrations/transactions/hooks/batch/use-mint-batch';
import {
  MintModalDataStep,
  MintTokenSymbol,
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useNotificationStore,
  useSwapViewStore,
} from '@/store';
import { deserialize, stringify } from '@/utils/format';

export interface MintXTCNotificationContentProps {
  id: string;
}

export const MintXTCNotificationContent: React.FC<
  MintXTCNotificationContentProps
> = ({ id }) => {
  const dispatch = useAppDispatch();
  const swapViewStore = useSwapViewStore();
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances } = useBalances();

  const { from, to, keepInSonic } = useMemo(() => {
    const { from, to, keepInSonic } = swapViewStore;

    return deserialize(stringify({ from, to, keepInSonic }));
  }, []);

  const { batch, openBatchModal } = useMintBatch({
    amountIn: from.value,
    amountOut: to.value,
    tokenSymbol: MintTokenSymbol.XTC,
    keepInSonic,
  });

  const handleStateChange = () => {
    if (
      Object.values(MintModalDataStep).includes(
        batch.state as MintModalDataStep
      )
    ) {
      dispatch(
        modalsSliceActions.setMintXTCModalData({
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
        dispatch(modalsSliceActions.closeMintXTCProgressModal());

        addNotification({
          title: `Minted ${to.value} ${to.metadata.symbol}`,
          type: NotificationType.Success,
          id: Date.now().toString(),
          transactionLink: '/activity',
        });
        getBalances();
      })
      .catch((err) => {
        console.error('Mint Error', err);

        addNotification({
          title: `Mint ${to.value} ${to.metadata.symbol} failed`,
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
