import { Box, Spinner } from '@chakra-ui/react';

import { closeSrc, redWarningSrc, transparentGreenCheckSrc } from '@/assets';
import { NotificationType } from '@/store';

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case NotificationType.Success:
      return (
        <Box
          as="img"
          src={transparentGreenCheckSrc}
          position="absolute"
          top={4}
          left={4}
        />
      );
    case NotificationType.MintAuto:

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
    case NotificationType.MintManual:
    case NotificationType.MintWICP:
    case NotificationType.WithdrawWICP:
    case NotificationType.Swap:
    case NotificationType.AddLiquidity:
    case NotificationType.RemoveLiquidity:
    case NotificationType.Deposit:
    case NotificationType.MintXTC:
    case NotificationType.Withdraw:
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
      {(type === NotificationType.Error ||
        type === NotificationType.Success) && (
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
