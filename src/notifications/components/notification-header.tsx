import { closeSrc, redWarningSrc, transparentGreenCheckSrc } from '@/assets';
import { NotificationType } from '@/store';
import { Box, Spinner } from '@chakra-ui/react';

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case NotificationType.Done:
      return (
        <Box
          as="img"
          src={transparentGreenCheckSrc}
          position="absolute"
          top={4}
          left={4}
        />
      );
    case NotificationType.Error:
      return (
        <Box
          as="img"
          src={redWarningSrc}
          position="absolute"
          top={4}
          left={4}
        />
      );
    case NotificationType.Swap:
      return <Spinner position="absolute" top={4} left={4} />;
    default:
      return null;
  }
};

export interface NotificationHeaderProps {
  type: NotificationType;
  handleClose: () => void;
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  type,
  handleClose,
}) => {
  return (
    <>
      <NotificationIcon type={type} />
      {type !== NotificationType.Swap && (
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
