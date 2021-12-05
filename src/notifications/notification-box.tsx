import { useState } from 'react';
import { Text, Flex, Box, Collapse, keyframes } from '@chakra-ui/react';

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
        borderRadius={5}
        bg="#1E1E1E"
        mb={8}
        pt={4}
        pr={11}
        pl={12}
        pb={4}
      >
        <Box as="img" src={iconSrc} position="absolute" top={4} left={4} />
        <Box
          cursor="pointer"
          onClick={handleClose}
          as="img"
          src={closeSrc}
          position="absolute"
          top={4}
          right={4}
        />
        <Flex direction="column" alignItems="flex-start">
          <Text color="#F6FCFD" fontSize="md" fontWeight={700} maxWidth="243px">
            {title}
          </Text>
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
          height={0.5}
          bg={animationColor}
          bottom={0.5}
          left={4}
          borderRadius={5}
          animation={collapseAnimation}
          onAnimationEnd={handleClose}
        />
      </Box>
    </Collapse>
  );
};
