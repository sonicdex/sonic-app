import { useState, ReactNode } from 'react';
import { Box, BoxProps, Flex, Image, Collapse } from '@chakra-ui/react';

import { closeSrc } from '@/assets';

type InformationBoxTypes = BoxProps & {
  title: string;
  children: ReactNode;
  onClose?: () => void;
};

export const InformationBox = ({
  title,
  children,
  onClose,
  ...props
}: InformationBoxTypes) => {
  const [collapse, setCollapse] = useState(true);

  const handleClose = () => {
    setCollapse(false);
    if (onClose) {
      setTimeout(onClose, 200);
    }
  };

  return (
    <Collapse in={collapse} unmountOnExit={true}>
      <Box
        bg="rgba(57, 77, 231, 0.2)"
        pt={4}
        px={5}
        pb={5}
        borderRadius={20}
        mb={5}
        {...props}
      >
        <Flex direction="row" justifyContent="space-between" mb={2}>
          <Box as="h3" fontSize="lg" fontWeight="bold" color="#F6FCFD">
            {title}
          </Box>
          <Image w={5} cursor="pointer" onClick={handleClose} src={closeSrc} />
        </Flex>
        {children}
      </Box>
    </Collapse>
  );
};
