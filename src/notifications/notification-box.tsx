import { useState } from 'react';
import { Flex, Box, Collapse, keyframes } from '@chakra-ui/react';

import { transparentGreenCheckSrc, redWarningSrc, closeSrc } from '@/assets';

type NotificationBoxProps = {
  title: string;
  transactionLink?: string;
  type?: 'done' | 'error';
  children?: React.ReactNode;
  onClose: () => any;
};

const reduceWidth = keyframes`
    from { width: calc(100% - 30px);}
    to { width: 0px; };
  `;

export const NotificationBox = ({
  title,
  transactionLink,
  onClose,
  type = 'done',
  children,
}: NotificationBoxProps) => {
  const [show, setShow] = useState(true);

  const animationColor = type === 'done' ? '#04CD95' : '#FF646D';
  const collapseAnimation = `${reduceWidth} 25s forwards linear`;
  const iconSrc = type === 'done' ? transparentGreenCheckSrc : redWarningSrc;

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  return (
    <Collapse in={show} animateOpacity unmountOnExit>
      <Box
        width="325px"
        position="relative"
        borderRadius="20px"
        bg="#1E1E1E"
        mb="30px"
        pt="15px"
        pr="43px"
        pl="45px"
        pb="18px"
      >
        <Box
          as="img"
          src={iconSrc}
          position="absolute"
          top="18px"
          left="15px"
        />
        <Box
          cursor="pointer"
          onClick={handleClose}
          as="img"
          src={closeSrc}
          position="absolute"
          top="18px"
          right="15px"
        />
        <Flex direction="column" alignItems="flex-start">
          <Box
            as="p"
            color="#F6FCFD"
            fontSize="16px"
            fontWeight={700}
            maxWidth="243px"
          >
            {title}
          </Box>
          {type === 'done' && transactionLink && (
            <Box
              as="a"
              href={transactionLink}
              target="_blank"
              rel="noreferrer"
              color="#3D52F4"
            >
              View on explorer
            </Box>
          )}
          {children}
        </Flex>
        <Box
          position="absolute"
          width="calc(100% - 30px)"
          height="2px"
          bg={animationColor}
          bottom="1px"
          left="15px"
          borderRadius="20px"
          animation={collapseAnimation}
          onAnimationEnd={handleClose}
        />
      </Box>
    </Collapse>
  );
};
