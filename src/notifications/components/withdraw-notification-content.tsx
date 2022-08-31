import { Link } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';

import { useBalances } from '@/hooks/use-balances';
import { useWithdrawBatch } from '@/integrations/transactions/hooks/batch/use-withdraw-batch';
import {
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useNotificationStore,
  useSwapCanisterStore,
  useWithdrawViewStore,
  WithdrawModalDataStep,
} from '@/store';
import { AppLog } from '@/utils';

export interface WithdrawNotificationContentProps {
  id: string;
}

export const WithdrawNotificationContent: React.FC<
  WithdrawNotificationContentProps
> = ({ id }) => {
  const dispatch = useAppDispatch();
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances } = useBalances();

  const { amount: value, tokenId } = useWithdrawViewStore();
  const { supportedTokenList } = useSwapCanisterStore();

  const selectedToken = useMemo(() => {
    if (tokenId && supportedTokenList) {
      return supportedTokenList.find(({ id }) => id === tokenId);
    }

    return undefined;
  }, [supportedTokenList, tokenId]);

  const { batch, openBatchModal } = useWithdrawBatch({
    amount: value,
    token: selectedToken,
  });

  const handleStateChange = () => {
    if (
      Object.values(WithdrawModalDataStep).includes(
        batch.state as WithdrawModalDataStep
      )
    ) {
      dispatch(
        modalsSliceActions.setWithdrawModalData({
          step: batch.state as WithdrawModalDataStep,
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
        dispatch(modalsSliceActions.clearWithdrawModalData());
        dispatch(modalsSliceActions.closeWithdrawProgressModal());
        addNotification({
          title: `Withdrawn ${value} ${selectedToken?.symbol}`,
          type: NotificationType.Success,
          id: Date.now().toString(),
          transactionLink: '/activity',
        });
        getBalances();
      })
      .catch((err) => {
        AppLog.error('Withdraw Error', err);
        dispatch(modalsSliceActions.clearWithdrawModalData());
        addNotification({
          title: `Withdraw ${value} ${selectedToken?.symbol} failed`,
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

