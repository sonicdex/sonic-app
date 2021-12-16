import { useTotalBalances } from '@/hooks/use-balances';
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
      case 'withdraw':
        dispatch(modalsSliceActions.setWithdrawData({ step: 'withdraw' }));

        break;
    }
  };

  const handleOpenModal = () => {
    handleStateChange();
    dispatch(modalsSliceActions.openWithdrawProgressModal());
  };

  useEffect(handleStateChange, [withdrawBatch.state]);

  useEffect(() => {
    withdrawBatch
      .execute()
      .then((res) => {
        console.log('Withdraw Completed', res);
        dispatch(modalsSliceActions.clearWithdrawData());
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
