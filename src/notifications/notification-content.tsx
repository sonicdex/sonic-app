import { Flex, Text, useColorModeValue } from '@chakra-ui/react';

import { NotificationType } from '@/store';

import { NotificationBoxProps } from '.';
import {
  AddLiquidityLink,
  DepositLink,
  MintAutoLink,
  MintManualLink,
  MintWICPLink,
  MintXTCLink,
  RemoveLiquidityLink,
  SwapLink,
  TransactionLink,
  WithdrawLink,
  WithdrawWICPLink,
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
  const notificationNode = {
    [NotificationType.Swap]: <SwapLink id={id} />,
    [NotificationType.AddLiquidity]: <AddLiquidityLink id={id} />,
    [NotificationType.RemoveLiquidity]: <RemoveLiquidityLink id={id} />,
    [NotificationType.Withdraw]: <WithdrawLink id={id} />,
    [NotificationType.Deposit]: <DepositLink id={id} />,
    [NotificationType.WithdrawWICP]: <WithdrawWICPLink id={id} />,
    [NotificationType.MintWICP]: <MintWICPLink id={id} />,
    [NotificationType.Deposit]: <DepositLink id={id} />,
    [NotificationType.MintXTC]: <MintXTCLink id={id} />,
    [NotificationType.Success]: transactionLink ? (
      <TransactionLink transactionLink={transactionLink} />
    ) : null,
    [NotificationType.MintAuto]: <MintAutoLink id={id} />,
    [NotificationType.MintManual]: <MintManualLink id={id} />,
    [NotificationType.Error]: <></>, // TODO: Add error link
  };

  const color = useColorModeValue('gray.800', 'gray.50');

  return (
    <Flex direction="column" alignItems="flex-start">
      <Text color={color} fontSize="md" fontWeight={700} maxWidth={60}>
        {title}
      </Text>

      {notificationNode[type]}

      {children}
    </Flex>
  );
};
