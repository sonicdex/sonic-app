import { NotificationType } from '@/store';
import { Flex, Text } from '@chakra-ui/react';
import { NotificationBoxProps } from '..';
import { SwapLink } from './swap-link';
import { TransactionLink } from './transaction-link';

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
  const notificationComponents = {
    [NotificationType.Swap]: (
      <SwapLink id={id} />
    ),
    [NotificationType.AddLiquidity]: (
    ),
    [NotificationType.RemoveLiquidity]: (
    ),
    [NotificationType.Withdraw]: (
    ),
    [NotificationType.Deposit]: (
    ),
  }

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
