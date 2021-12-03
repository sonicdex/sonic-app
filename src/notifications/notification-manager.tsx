import { Flex } from '@chakra-ui/react';
import { useNotificationStore } from '@/store';
import { ERRORS, ErrorNotificationType } from './notifications.constants';

import { NotificationBox } from './notification-box';

export const NotificationManager = () => {
  const { notifications, popNotification } = useNotificationStore();

  return (
    <Flex position="absolute" right="50px" direction="column" zIndex={0}>
      {notifications.map((notification) => {
        const { errorMessage, id, title, type, transactionLink } = notification;
        const errorBody =
          errorMessage && ERRORS.hasOwnProperty(errorMessage)
            ? ERRORS[errorMessage as ErrorNotificationType]
            : undefined;

        return (
          <NotificationBox
            key={id}
            title={title}
            transactionLink={transactionLink}
            type={type}
            onClose={() => popNotification(notification.id)}
          >
            {errorBody}
          </NotificationBox>
        );
      })}
    </Flex>
  );
};
