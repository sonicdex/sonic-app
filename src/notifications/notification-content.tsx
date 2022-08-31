import { Flex, Text, useColorModeValue } from '@chakra-ui/react';

import { Notification, NotificationType } from '@/store';

import {
  AddLiquidityNotificationContent,
  DepositNotificationContent,
  MintAutoNotificationContent,
  MintManualNotificationContent,
  MintWICPNotificationContent,
  MintXTCNotificationContent,
  RemoveLiquidityNotificationContent,
  SwapNotificationContent,
  TransactionNotificationContent,
  WithdrawNotificationContent,
  WithdrawWICPNotificationContent,
} from './components';

export type NotificationContentProps = Notification;

export const NotificationContent: React.FC<NotificationContentProps> = ({
  children,
  id,
  type,
  state,
  title,
  transactionLink,
  errorMessage,
}) => {
  const messageColor = useColorModeValue('gray.400', 'gray.600');

  const color = useColorModeValue('gray.800', 'gray.50');

  const notificationContent = {
    [NotificationType.Swap]: <SwapNotificationContent id={id} />,
    [NotificationType.AddLiquidity]: (
      <AddLiquidityNotificationContent id={id} />
    ),
    [NotificationType.RemoveLiquidity]: (
      <RemoveLiquidityNotificationContent id={id} />
    ),
    [NotificationType.Withdraw]: <WithdrawNotificationContent id={id} />,
    [NotificationType.Deposit]: <DepositNotificationContent id={id} />,
    [NotificationType.WithdrawWICP]: (
      <WithdrawWICPNotificationContent id={id} />
    ),
    [NotificationType.MintWICP]: <MintWICPNotificationContent id={id} />,
    [NotificationType.Deposit]: <DepositNotificationContent id={id} />,
    [NotificationType.MintXTC]: <MintXTCNotificationContent id={id} />,
    [NotificationType.Success]: transactionLink ? (
      <TransactionNotificationContent transactionLink={transactionLink} />
    ) : null,
    [NotificationType.MintAuto]: (
      <MintAutoNotificationContent id={id} state={state} />
    ),
    [NotificationType.MintManual]: <MintManualNotificationContent id={id} />,
    [NotificationType.Error]: errorMessage && (
      <Text fontSize="sm" color={messageColor}>
        {errorMessage}
      </Text>
    ),
  };

  return (
    <Flex direction="column" alignItems="flex-start">
      <Text color={color} fontWeight={700} maxWidth={60}>
        {title}
      </Text>

      {notificationContent[type]}

      {children}
    </Flex>
  );
};

