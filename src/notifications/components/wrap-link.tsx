import { Link } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';

import { useBalances } from '@/hooks/use-balances';
import { useMintWICPBatch } from '@/integrations/transactions/factories/batch/mint-wicp';
import {
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useNotificationStore,
  useSwapViewStore,
  WrapModalDataStep,
} from '@/store';
import { deserialize, stringify } from '@/utils/format';

export interface WrapLinkProps {
  id: string;
}

export const WrapLink: React.FC<WrapLinkProps> = ({ id }) => {
  const dispatch = useAppDispatch();
  const swapViewStore = useSwapViewStore();
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances } = useBalances();

  const { from, keepInSonic } = useMemo(() => {
    const { from, keepInSonic } = swapViewStore;

    return deserialize(stringify({ from, keepInSonic }));
  }, []);

  const [batch, openWrapModal] = useMintWICPBatch({
    amount: from.value,
    keepInSonic,
  });

  const handleStateChange = () => {
    if (
      Object.values(WrapModalDataStep).includes(
        batch.state as WrapModalDataStep
      )
    ) {
      dispatch(
        modalsSliceActions.setWrapModalData({
          step: batch.state as WrapModalDataStep,
        })
      );
    }
  };

  const handleOpenModal = () => {
    handleStateChange();
    openWrapModal();
  };
  useEffect(handleStateChange, [batch.state]);

  useEffect(() => {
    batch
      .execute()
      .then(() => {
        dispatch(modalsSliceActions.closeWrapProgressModal());

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
