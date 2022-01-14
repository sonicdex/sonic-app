import { Flex, Text } from '@chakra-ui/react';

import { NotificationType } from '@/store';

import { NotificationBoxProps } from '.';
import {
  AddLiquidityLink,
  DepositLink,
  RemoveLiquidityLink,
  SwapLink,
  TransactionLink,
  UnwrapLink,
  WithdrawLink,
  WrapLink,
} from './components';

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
    [NotificationType.Unwrap]: <UnwrapLink id={id} />,
    [NotificationType.Wrap]: <WrapLink id={id} />,
    [NotificationType.Deposit]: <DepositLink id={id} />,
    [NotificationType.Success]: transactionLink ? (
      <TransactionLink transactionLink={transactionLink} />
    ) : null,
    [NotificationType.Error]: <></>, // TODO: Add error
  };

  return (
    <Flex direction="column" alignItems="flex-start">
      <Text color="gray.50" fontSize="md" fontWeight={700} maxWidth={60}>
        {title}
      </Text>

      {notificationComponents[type]}

      {children}
    </Flex>
  );
};
