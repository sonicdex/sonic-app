import { Flex, Text } from '@chakra-ui/react';

import { NotificationType } from '@/store';

import {
  AddLiquidityLink,
  DepositLink,
  RemoveLiquidityLink,
  WithdrawLink,
  SwapLink,
  TransactionLink,
} from './components';
import { NotificationBoxProps } from '.';

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
    [NotificationType.Swap]: <SwapLink id={id} />,
    [NotificationType.AddLiquidity]: <AddLiquidityLink id={id} />,
    [NotificationType.RemoveLiquidity]: <RemoveLiquidityLink id={id} />,
    [NotificationType.Withdraw]: <WithdrawLink id={id} />,
    [NotificationType.Deposit]: <DepositLink id={id} />,
    [NotificationType.Done]: (
      <TransactionLink transactionLink={transactionLink} />
    ),
    [NotificationType.Error]: <></>, // TODO: Add error
  };

  return (
    <Flex direction="column" alignItems="flex-start">
      <Text color="#F6FCFD" fontSize="md" fontWeight={700} maxWidth={60}>
        {title}
      </Text>

      {notificationComponents[type]}

      {children}
    </Flex>
  );
};
