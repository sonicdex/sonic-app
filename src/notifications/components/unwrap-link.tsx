import { useBalances } from '@/hooks/use-balances';
import { useUnwrapBatch } from '@/integrations/transactions';

import {
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useNotificationStore,
  usePlugStore,
  useSwapViewStore,
} from '@/store';
import { deserialize, stringify } from '@/utils/format';
import { createCAPLink } from '@/utils/function';
import { getAccountId } from '@/utils/icp';
import { Link } from '@chakra-ui/react';
import { Principal } from '@dfinity/principal';
import { useEffect, useMemo } from 'react';

export interface UnwrapLinkProps {
  id: string;
}

export const UnwrapLink: React.FC<UnwrapLinkProps> = ({ id }) => {
  const { principalId } = usePlugStore();
  const dispatch = useAppDispatch();
  const swapViewStore = useSwapViewStore();
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances } = useBalances();

  const { from } = useMemo(() => {
    const { from } = swapViewStore;

    return deserialize(stringify({ from }));
  }, []);

  const handleStateChange = () => {
    switch (unwrapBatch.state) {
      case 'withdrawWICP':
        dispatch(modalsSliceActions.setUnwrapData({ step: 'withdrawWICP' }));

        break;
    }
  };

  const handleOpenModal = () => {
    handleStateChange();
    openUnwrapModal();
  };

  const [unwrapBatch, openUnwrapModal] = useUnwrapBatch({
    amount: from.value,
    toAccountId: getAccountId(Principal.from(principalId)),
  });

  useEffect(handleStateChange, [unwrapBatch.state]);

  useEffect(() => {
    unwrapBatch
      .execute()
      .then((res) => {
        console.log('Unwrap Completed', res);
        dispatch(modalsSliceActions.closeUnwrapProgressModal());

        addNotification({
          title: `Unwrapped ${from.value} ${from.metadata.symbol}`,
          type: NotificationType.Success,
          id: Date.now().toString(),
          // TODO: add transaction id
          transactionLink: createCAPLink('transactionId'),
        });
        getBalances();
      })
      .catch((err) => {
        console.error('Unwrap Error', err);

        addNotification({
          title: `Failed unwrapping ${from.value} ${from.metadata.symbol}`,
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
