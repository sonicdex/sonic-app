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
  title,
  onClose,
  type,
  children,
  transactionLink,
  id,
  timeout,
}: NotificationBoxProps) => {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  const bg = useColorModeValue('gray.50', 'custom.2');
  const shadow = useColorModeValue('sm', 'none');

  return (
    <Collapse in={show} animateOpacity unmountOnExit>
      <Box
        width={80}
        position="relative"
        borderRadius={5}
        shadow={shadow}
        bg={bg}
        mb={8}
        pt={4}
        pr={10}
        pl={12}
        pb={4}
      >
        <NotificationHeader handleClose={handleClose} type={type} />
        <NotificationContent
          title={title}
          type={type}
          transactionLink={transactionLink}
          id={id}
        >
          {children}
        </NotificationContent>
        <NotificationTimer
          handleClose={handleClose}
          type={type}
          timeout={timeout}
        />
      </Box>
    </Collapse>
  );
};
