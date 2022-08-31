import { Flex } from '@chakra-ui/react';

import { useNotificationStore } from '@/store';

import { NotificationBox } from './notification-box';
import { ErrorNotificationType, ERRORS } from './notification-errors';

export const NotificationManager = () => {
  const { notifications, popNotification } = useNotificationStore();

  return (
    <Flex position="fixed" right={12} direction="column" zIndex={2}>
      {notifications.map((notification) => {
        const { errorMessage } = notification;
        const errorBody =
          errorMessage && ERRORS.hasOwnProperty(errorMessage)
            ? ERRORS[errorMessage as ErrorNotificationType]
            : undefined;

        return (
          <NotificationBox
            key={notification.id}
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
