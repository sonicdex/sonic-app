import { Box, Collapse, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';

import { Notification } from '@/store';

import { NotificationContent } from './notification-content';
import { NotificationHeader } from './notification-header';
import { NotificationTimer } from './notification-timer';

export type NotificationBoxProps = Notification & {
  children?: React.ReactNode;
  onClose: () => any;
};

export const NotificationBox = ({
  children,
  onClose,
  ...notification
}: NotificationBoxProps) => {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  const bg = useColorModeValue('gray.50', 'custom.2');
  const borderColor = useColorModeValue('gray.100', 'custom.4');

  return (
    <Collapse in={show} animateOpacity unmountOnExit>
      <Box
        width={80}
        position="relative"
        borderRadius={5}
        border="1px solid"
        borderColor={borderColor}
        shadow="md"
        bg={bg}
        mb={4}
        mx={2}
        pt={4}
        pr={10}
        pl={12}
        pb={4}
        overflow="hidden"
      >
        <NotificationHeader {...notification} handleClose={handleClose} />
        <NotificationContent {...notification}>{children}</NotificationContent>
        <NotificationTimer {...notification} handleClose={handleClose} />
      </Box>
    </Collapse>
  );
};
