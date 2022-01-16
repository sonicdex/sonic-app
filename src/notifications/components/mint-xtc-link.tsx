import { Link } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';

import { useBalances } from '@/hooks/use-balances';
import { useMintXTCBatch } from '@/integrations/transactions/factories/batch/mint-xtc';
import {
  MintXTCModalDataStep,
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useNotificationStore,
  useSwapViewStore,
} from '@/store';
import { deserialize, stringify } from '@/utils/format';

export interface MintXTCLinkProps {
  id: string;
}

export const MintXTCLink: React.FC<MintXTCLinkProps> = ({ id }) => {
  const dispatch = useAppDispatch();
  const swapViewStore = useSwapViewStore();
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances } = useBalances();

  const { from, keepInSonic } = useMemo(() => {
    const { from, keepInSonic } = swapViewStore;

    return deserialize(stringify({ from, keepInSonic }));
  }, []);

  const [batch, openMintXTCProgressModal] = useMintXTCBatch({
    amount: from.value,
    keepInSonic,
  });

  const handleStateChange = () => {
    if (
      Object.values(MintXTCModalDataStep).includes(
        batch.state as MintXTCModalDataStep
      )
    ) {
      dispatch(
        modalsSliceActions.setMintXTCModalData({
          step: batch.state as MintXTCModalDataStep,
        })
      );
    }
  };

  const handleOpenModal = () => {
    handleStateChange();
    openMintXTCProgressModal();
  };
  useEffect(handleStateChange, [batch.state, dispatch]);

  useEffect(() => {
    batch
      .execute()
      .then(() => {
        dispatch(modalsSliceActions.closeMintXTCProgressModal());

        addNotification({
          title: `Minted ${from.value} ${from.metadata.symbol}`,
          type: NotificationType.Success,
          id: Date.now().toString(),
          transactionLink: '/activity',
        });
        getBalances();
      })
      .catch((err) => {
        console.error('Mint Error', err);

        addNotification({
          title: `Mint ${from.value} ${from.metadata.symbol} failed`,
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
      color="dark-gray.500"
      onClick={handleOpenModal}
    >
      View progress
    </Link>
  );
};
