import { Flex } from '@chakra-ui/react';
import { useNotificationStore } from '@/store';
import { ERRORS, ErrorNotificationType } from './notifications.constants';

import { NotificationBox } from './notification-box';

export const NotificationManager = () => {
  const { notifications, popNotification } = useNotificationStore();

  return (
    <Flex position="absolute" right={12} direction="column" zIndex={99}>
      {notifications.map((notification) => {
        const { errorMessage } = notification;
        const errorBody =
          errorMessage && ERRORS.hasOwnProperty(errorMessage)
            ? ERRORS[errorMessage as ErrorNotificationType]
            : undefined;

        return (
          <NotificationBox
            {...notification}
            onClose={() => popNotification(notification.id)}
          >
            {errorBody}
          </NotificationBox>
        );
      })}
    </Flex>
  );
};
