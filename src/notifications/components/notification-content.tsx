import { useSwapBatch } from '@/integrations/transactions';
import { MODALS } from '@/modals';
import {
  NotificationType,
  swapViewActions,
  useAppDispatch,
  useModalStore,
  useNotificationStore,
  usePlugStore,
  useSwapViewStore,
} from '@/store';
import { createCAPLink } from '@/utils/function';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { NotificationBoxProps } from '..';

const TransactionLink = ({ transactionLink }: { transactionLink?: string }) => {
  return (
    <Box
      as="a"
      href={transactionLink}
      target="_blank"
      rel="noreferrer"
      color="#3D52F4"
    >
      View on explorer
    </Box>
  );
};

const SwapLink = () => {
  const { setCurrentModal, clearModal, setCurrentModalState } = useModalStore();
  const { from, to, slippage, keepInSonic } = useSwapViewStore();
  const { addNotification, popNotification } = useNotificationStore();
  const dispatch = useAppDispatch();
  const { principalId } = usePlugStore();

  const handleStateChange = () => {
    console.log('state change', swapBatch.state);
    switch (swapBatch.state as any) {
      case 'approve':
      case 'deposit':
        setCurrentModalState('deposit');
        break;
      case 'swap':
        setCurrentModalState('swap');
        break;
      case 'withdraw':
        setCurrentModalState('withdraw');
        break;
    }
  };

  const swapBatch = useSwapBatch({
    from,
    to,
    slippage: Number(slippage),
    keepInSonic,
    principalId,
  });

  const handleOpenModal = () => {
    handleStateChange();
    setCurrentModal(MODALS.swapProgress);
  };

  useEffect(() => {
    swapBatch
      .execute()
      .then((res) => {
        console.log('Swap Completed', res);
        clearModal();
        addNotification({
          title: `Swapped ${from.value} ${from.token?.symbol} for ${to.value} ${to.token?.symbol}`,
          type: NotificationType.Done,
          id: Date.now().toString(),
          // TODO: add transaction id
          transactionLink: createCAPLink('transactionId'),
        });
        dispatch(swapViewActions.setValue({ data: 'from', value: '0.00' }));
        // getBalances();
        popNotification('swap');
      })
      .catch((err) => {
        console.error('Swap Error', err);
        setCurrentModal(MODALS.swapFailed);
      });
  }, []);

  useEffect(handleStateChange, [swapBatch.state]);

  return (
    <Box
      as="a"
      target="_blank"
      rel="noreferrer"
      color="#3D52F4"
      onClick={handleOpenModal}
      cursor="pointer"
    >
      View progress
    </Box>
  );
};

export type NotificationContentProps = Pick<
  NotificationBoxProps,
  'type' | 'children' | 'title' | 'transactionLink'
>;

export const NotificationContent: React.FC<NotificationContentProps> = ({
  type,
  title,
  children,
  transactionLink,
}) => {
  return (
    <Flex direction="column" alignItems="flex-start">
      <Text color="#F6FCFD" fontSize="md" fontWeight={700} maxWidth={60}>
        {title}
      </Text>

      {type === NotificationType.Swap ? (
        <SwapLink />
      ) : type === NotificationType.Done ? (
        <TransactionLink transactionLink={transactionLink} />
      ) : null}

      {children}
    </Flex>
  );
};
