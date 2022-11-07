import { Box, Spinner } from '@chakra-ui/react';
import { useMemo } from 'react';

import { closeSrc, redWarningSrc, transparentGreenCheckSrc } from '@/assets';
import {
  Notification,
  NotificationState,
  NotificationType,
  useNotificationStore,
} from '@/store';

const NotificationIcon = ({ type, state }: Partial<Notification>) => {
  const errorNode = (
    <Box as="img" src={redWarningSrc} position="absolute" top={4} left={4} />
  );
  const pendingNode = <Spinner position="absolute" top={4} left={4} />;
  const successNode = (
    <Box
      as="img"
      src={transparentGreenCheckSrc}
      position="absolute"
      top={4}
      left={4}
    />
  );

  switch (state) {
    case NotificationState.Error:
      return errorNode;
    case NotificationState.Pending:
      return pendingNode;
    case NotificationState.Success:
      return successNode;
  }

  switch (type) {
    case NotificationType.Success:
      return successNode;
    case NotificationType.MintAuto:
    case NotificationType.Error:
      return errorNode;
    case NotificationType.MintManual:
    case NotificationType.MintWICP:
    case NotificationType.WithdrawWICP:
    case NotificationType.Swap:
    case NotificationType.AddLiquidity:
    case NotificationType.RemoveLiquidity:
    case NotificationType.Deposit:
    case NotificationType.MintXTC:
    case NotificationType.Withdraw:
      return pendingNode;
    default:
      return null;
  }
};

export type NotificationHeaderProps = Notification & {
  handleClose: () => void;
};

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  id,
  type,
  state,
  handleClose,
}) => {
  const { notifications } = useNotificationStore();

  const notification = useMemo(
    () => notifications.find((n) => n.id === id),
    [notifications, id]
  );

  const shouldShowCloseButton = useMemo(
    () =>
      type === NotificationType.Error ||
      type === NotificationType.Success ||
      notification?.state === NotificationState.Success,
    [type, notification]
  );

  return (
    <>
      <NotificationIcon state={state} type={type} />
      {shouldShowCloseButton && (
        <Box
          cursor="pointer"
          onClick={handleClose}
          as="img"
          src={closeSrc}
          position="absolute"
          top={4}
          right={4}
        />
      )}
    </>
  );
};
