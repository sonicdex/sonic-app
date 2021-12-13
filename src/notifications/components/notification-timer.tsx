import { NotificationType } from '@/store';
import { Box } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useMemo } from 'react';

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
  if (type === NotificationType.Swap) return null;

  const color = useMemo(() => {
    switch (type) {
      case NotificationType.Done:
        return '#04CD95';
      case NotificationType.Error:
        return '#FF646D';
      default:
        return 'gray.500';
    }
  }, [type]);

  const collapseAnimation = `${reduceWidth} 25s forwards linear`;

  return (
    <Box
      position="absolute"
      width="calc(100% - 30px)"
      height={0.5}
      bg={color}
      bottom={0.5}
      left={4}
      borderRadius={5}
      animation={collapseAnimation}
      onAnimationEnd={handleClose}
    />
  );
};
