import { useBalances } from '@/hooks/use-balances';
import { useWithdrawBatch } from '@/integrations/transactions/factories/batch/withdraw';
import {
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
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
  const dispatch = useAppDispatch();
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances } = useBalances();

  const { amount: value, tokenId } = useWithdrawViewStore();
  const { supportedTokenList } = useSwapStore();

  const selectedToken = useMemo(() => {
    return supportedTokenList?.find(({ id }) => id === tokenId);
  }, [supportedTokenList, tokenId]);

  const [batch, openModal] = useWithdrawBatch({
    amount: value,
    token: selectedToken,
  });

  const handleStateChange = () => {
    switch (batch.state) {
      case 'withdraw':
        dispatch(modalsSliceActions.setWithdrawData({ step: 'withdraw' }));

        break;
    }
  };

  const handleOpenModal = () => {
    handleStateChange();
    openModal();
  };

  useEffect(handleStateChange, [batch.state]);

  useEffect(() => {
    batch
      .execute()
      .then((res) => {
        console.log('Withdraw Completed', res);
        dispatch(modalsSliceActions.clearWithdrawData());
        dispatch(modalsSliceActions.closeWithdrawProgressModal());
        addNotification({
          title: 'Withdraw successful',
          type: NotificationType.Success,
          id: Date.now().toString(),
          // TODO: add transaction id
          transactionLink: createCAPLink('transactionId'),
        });
        getBalances();
      })
      .catch((err) => {
        console.error('Withdraw Error', err);
        dispatch(modalsSliceActions.clearWithdrawData());
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
