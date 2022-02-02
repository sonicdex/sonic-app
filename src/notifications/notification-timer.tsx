import { Box } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useMemo } from 'react';

import { NotificationType } from '@/store';

const reduceWidth = keyframes`
    from { width: calc(100% - 30px);}
    to { width: 0px; };
`;

export interface NotificationTimerProps {
  type: NotificationType;
  timeout?: string;
  handleClose: () => void;
}

export const NotificationTimer: React.FC<NotificationTimerProps> = ({
  type,
  timeout = '6s',
  handleClose,
}) => {
  const color = useMemo(() => {
    switch (type) {
      case NotificationType.Success:
        return '#04CD95';
      case NotificationType.Error:
        return '#FF646D';
      default:
        return 'gray.500';
    }
  }, [type]);

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
      height={0.5}
      bg={color}
      bottom={0.5}
      left={0}
      right={0}
      borderRadius={5}
      animation={collapseAnimation}
      onAnimationEnd={handleClose}
    />
  );
};
