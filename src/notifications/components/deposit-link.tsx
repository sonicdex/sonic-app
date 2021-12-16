import { useTotalBalances } from '@/hooks/use-balances';
import { useDepositBatch } from '@/integrations/transactions';
import { Modals } from '@/modals';
import {
  NotificationType,
  useDepositViewStore,
  useModalStore,
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
  const { setCurrentModal, clearModal, setCurrentModalState } = useModalStore();
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances } = useTotalBalances();

  const { value, tokenId } = useDepositViewStore();
  const { supportedTokenList } = useSwapStore();

  const selectedToken = useMemo(() => {
    return supportedTokenList?.find(({ id }) => id === tokenId);
  }, [supportedTokenList, tokenId]);

  const depositBatch = useDepositBatch({
    amount: value,
    token: selectedToken,
  });

  const handleStateChange = () => {
    switch (depositBatch.state) {
      case 'approve':
        setCurrentModalState('approve');
        break;
      case 'deposit':
        setCurrentModalState('deposit');
        break;
    }
  };

  const handleOpenModal = () => {
    handleStateChange();
    setCurrentModal(Modals.Deposit);
  };

  useEffect(handleStateChange, [depositBatch.state]);

  useEffect(() => {
    depositBatch
      .execute()
      .then((res) => {
        console.log('Swap Completed', res);
        clearModal();
        addNotification({
          title: 'Deposit successful',
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
