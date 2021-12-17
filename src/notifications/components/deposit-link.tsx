import { useBalances } from '@/hooks/use-balances';
import { useDepositBatch } from '@/integrations/transactions';
import {
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useDepositViewStore,
  useNotificationStore,
  useSwapStore,
} from '@/store';
import { createCAPLink } from '@/utils/function';
import { Link } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';

export interface DepositLinkProps {
  id: string;
}

export const DepositLink: React.FC<DepositLinkProps> = ({ id }) => {
  const dispatch = useAppDispatch();
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances } = useBalances();

  const { amount: value, tokenId } = useDepositViewStore();
  const { supportedTokenList } = useSwapStore();

  const selectedToken = useMemo(() => {
    return supportedTokenList?.find(({ id }) => id === tokenId);
  }, [supportedTokenList, tokenId]);

  const [depositBatch, openDepositModal] = useDepositBatch({
    amount: value,
    token: selectedToken,
  });

  const handleStateChange = () => {
    switch (depositBatch.state) {
      case 'approve':
        dispatch(modalsSliceActions.setDepositData({ step: 'approve' }));
        break;
      case 'deposit':
        dispatch(modalsSliceActions.setDepositData({ step: 'deposit' }));
        break;
    }
  };

  const handleOpenModal = () => {
    handleStateChange();
    openDepositModal();
  };

  useEffect(handleStateChange, [depositBatch.state]);

  useEffect(() => {
    depositBatch
      .execute()
      .then((res) => {
        console.log('Deposit Completed', res);
        dispatch(modalsSliceActions.clearDepositData());
        dispatch(modalsSliceActions.closeDepositProgressModal());
        getBalances();
        addNotification({
          title: 'Deposit successful',
          type: NotificationType.Done,
          id: Date.now().toString(),
          // TODO: add transaction id
          transactionLink: createCAPLink('transactionId'),
        });
      })
      .catch((err) => {
        console.error('Deposit Error', err);
        dispatch(modalsSliceActions.clearDepositData());
        addNotification({
          title: `Deposit failed ${value} ${selectedToken?.symbol}`,
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
