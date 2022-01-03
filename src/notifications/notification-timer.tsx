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
  handleClose: () => void;
}

export const NotificationTimer: React.FC<NotificationTimerProps> = ({
  type,
  handleClose,
}) => {
  if (type !== NotificationType.Success && type !== NotificationType.Error) {
    return null;
  }

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

  const collapseAnimation = `${reduceWidth} 10s forwards linear`;

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
