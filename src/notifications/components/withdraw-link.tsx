import { useTotalBalances } from '@/hooks/use-balances';
import { useWithdrawBatch } from '@/integrations/transactions/factories/batch/withdraw';
import { Modals } from '@/modals';
import {
  NotificationType,
  useModalStore,
  useNotificationStore,
  useSwapStore,
  useWithdrawViewStore,
} from '@/store';
import { createCAPLink } from '@/utils/function';
import { Link } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';

export interface WithdrawLinkProps {
  id: string;
}

export const WithdrawLink: React.FC<WithdrawLinkProps> = ({ id }) => {
  const { setCurrentModal, clearModal, setCurrentModalState } = useModalStore();
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances } = useTotalBalances();

  const { amount: value, tokenId } = useWithdrawViewStore();
  const { supportedTokenList } = useSwapStore();

  const selectedToken = useMemo(() => {
    return supportedTokenList?.find(({ id }) => id === tokenId);
  }, [supportedTokenList, tokenId]);

  const withdrawBatch = useWithdrawBatch({
    amount: value,
    token: selectedToken,
  });

  const handleStateChange = () => {
    switch (withdrawBatch.state) {
      case 'approve':
        setCurrentModalState('approve');
        break;
      case 'withdraw':
        setCurrentModalState('withdraw');
        break;
    }
  };

  const handleOpenModal = () => {
    handleStateChange();
    setCurrentModal(Modals.Withdraw);
  };

  useEffect(handleStateChange, [withdrawBatch.state]);

  useEffect(() => {
    withdrawBatch
      .execute()
      .then((res) => {
        console.log('Withdraw Completed', res);
        clearModal();
        addNotification({
          title: 'Withdraw successful',
          type: NotificationType.Done,
          id: Date.now().toString(),
          // TODO: add transaction id
          transactionLink: createCAPLink('transactionId'),
        });
        getBalances();
      })
      .catch((err) => {
        console.error('Withdraw Error', err);
        clearModal();
        addNotification({
          title: `Withdraw failed ${value} ${selectedToken?.symbol}`,
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
