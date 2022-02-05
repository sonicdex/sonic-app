import { Link } from '@chakra-ui/react';
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
import { deserialize, stringify } from '@/utils/format';

export interface MintWICPProps {
  id: string;
}

export const MintWICPLink: React.FC<MintWICPProps> = ({ id }) => {
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
