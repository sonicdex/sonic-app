import { MODALS } from '@/modals';
import { NotificationType, useModalStore } from '@/store';
import { Box, Flex, Text } from '@chakra-ui/react';
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
  const { setCurrentModal } = useModalStore();

  const handleOpenModal = () => {
    setCurrentModal(MODALS.swapProgress);
  };

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
