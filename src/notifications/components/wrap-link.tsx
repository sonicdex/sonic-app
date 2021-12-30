import { useBalances } from '@/hooks/use-balances';
import { useWrapBatch } from '@/integrations/transactions/factories/batch/wrap';

import {
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useNotificationStore,
  useSwapViewStore,
} from '@/store';
import { deserialize, stringify } from '@/utils/format';
import { createCAPLink } from '@/utils/function';
import { Link } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';

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

  const handleStateChange = () => {
    switch (wrapBatch.state) {
      case 'ledgerTransfer':
        dispatch(modalsSliceActions.setWrapData({ step: 'ledgerTransfer' }));

        break;
      case 'mintWICP':
        dispatch(modalsSliceActions.setWrapData({ step: 'mintWICP' }));

        break;
      case 'withdraw':
        dispatch(modalsSliceActions.setWrapData({ step: 'withdraw' }));

        break;
    }
  };

  const handleOpenModal = () => {
    handleStateChange();
    openWrapModal();
  };

  const [wrapBatch, openWrapModal] = useWrapBatch({
    amount: from.value,
    keepInSonic,
  });

  useEffect(handleStateChange, [wrapBatch.state]);

  useEffect(() => {
    wrapBatch
      .execute()
      .then((res) => {
        console.log('Wrap Completed', res);
        dispatch(modalsSliceActions.closeWrapProgressModal());

        addNotification({
          title: `Wrapped ${from.value} ${from.metadata.symbol}`,
          type: NotificationType.Success,
          id: Date.now().toString(),
          // TODO: add transaction id
          transactionLink: createCAPLink('transactionId'),
        });
        getBalances();
      })
      .catch((err) => {
        console.error('Wrap Error', err);

        addNotification({
          title: `Failed wrapping ${from.value} ${from.metadata.symbol}`,
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
