import { useState, ReactNode } from 'react';
import { Box, Flex, Image, Collapse } from '@chakra-ui/react';

import { closeSrc } from '@/assets';

type InformationBoxTypes = {
  title: string;
  children: ReactNode;
  onClose?: () => void;
  mb?: string;
};

export const InformationBox = ({
  title,
  children,
  onClose,
  mb = '20px',
}: InformationBoxTypes) => {
  const [collapse, setCollapse] = useState(true);

  const handleClose = () => {
    setCollapse(false);
    if (onClose) {
      setTimeout(onClose, 200);
    }
  };

  return (
    <>
      <Collapse in={collapse} unmountOnExit={true}>
        <Box
          bg="rgba(57, 77, 231, 0.2)"
          pt="16px"
          px="20px"
          pb="21px"
          mb={mb}
          borderRadius={20}
        >
          <Flex direction="row" justifyContent="space-between" mb="7px">
            <Box as="h3" fontSize="18px" fontWeight="700" color="#F6FCFD">
              {title}
            </Box>
            <Image
              w="18px"
              cursor="pointer"
              onClick={handleClose}
              src={closeSrc}
            />
          </Flex>
          {children}
        </Box>
      </Collapse>
    </>
  );
};
