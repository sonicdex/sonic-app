import { Box } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useMemo } from 'react';

import { Notification, NotificationState, NotificationType } from '@/store';

const reduceWidth = keyframes`
    from { width: 100%;}
    to { width: 0px; };
`;

export type NotificationTimerProps = Notification & {
  handleClose: () => void;
};

export const NotificationTimer: React.FC<NotificationTimerProps> = ({
  type,
  state,
  timeout = '6s',
  handleClose,
}) => {
  const color = useMemo(() => {
    if (
      type === NotificationType.Success ||
      state === NotificationState.Success
    ) {
      return '#04CD95';
    }
    if (type === NotificationType.Error || state === NotificationState.Error) {
      return '#FF646D';
    }

    return 'gray.500';
  }, [type, state]);

  if (
    (type !== NotificationType.Success && type !== NotificationType.Error) ||
    timeout === 'none'
  ) {
    return null;
  }

  const collapseAnimation = `${reduceWidth} ${timeout} forwards linear`;

  return (
    <Box
      position="absolute"
      width="full"
      height={1}
      bg={color}
      bottom={0}
      left={0}
      right={0}
      animation={collapseAnimation}
      onAnimationEnd={handleClose}
    />
  );
};
