import { Link } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';

import { useBalances } from '@/hooks/use-balances';
import { useWithdrawBatch } from '@/integrations/transactions/factories/batch/withdraw';
import {
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useNotificationStore,
  useSwapCanisterStore,
  useWithdrawViewStore,
  WithdrawModalDataStep,
} from '@/store';
import { createCAPLink } from '@/utils/function';

export interface WithdrawLinkProps {
  id: string;
}

export const WithdrawLink: React.FC<WithdrawLinkProps> = ({ id }) => {
  const dispatch = useAppDispatch();
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances } = useBalances();

  const { amount: value, tokenId } = useWithdrawViewStore();
  const { supportedTokenList } = useSwapCanisterStore();

  const selectedToken = useMemo(() => {
    return supportedTokenList?.find(({ id }) => id === tokenId);
  }, [supportedTokenList, tokenId]);

  const [batch, openModal] = useWithdrawBatch({
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
    openModal();
  };

  useEffect(handleStateChange, [batch.state]);

  useEffect(() => {
    batch
      .execute()
      .then((res) => {
        dispatch(modalsSliceActions.clearWithdrawModalData());
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
        dispatch(modalsSliceActions.clearWithdrawModalData());
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
