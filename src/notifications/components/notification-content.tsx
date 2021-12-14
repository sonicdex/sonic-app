import { NotificationType } from '@/store';
import { Box, Flex, Text } from '@chakra-ui/react';
import { NotificationBoxProps } from '..';
import { SwapLink } from './swap-link';

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

export type NotificationContentProps = Pick<
  NotificationBoxProps,
  'type' | 'children' | 'title' | 'transactionLink' | 'id'
>;

export const NotificationContent: React.FC<NotificationContentProps> = ({
  type,
  title,
  children,
  transactionLink,
  id,
}) => {
  return (
    <Flex direction="column" alignItems="flex-start">
      <Text color="#F6FCFD" fontSize="md" fontWeight={700} maxWidth={60}>
        {title}
      </Text>

      {type === NotificationType.Swap ? (
        <SwapLink id={id} />
      ) : type === NotificationType.Done ? (
        <TransactionLink transactionLink={transactionLink} />
      ) : null}

      {children}
    </Flex>
  );
};
