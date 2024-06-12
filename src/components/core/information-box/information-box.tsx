import {
  Box,
  BoxProps,
  CloseButton,
  Collapse,
  Flex,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { ReactNode, useState } from 'react';

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

  const titleColor = useColorModeValue('gray.800', 'gray.50');
  const bg = useColorModeValue('green.100', 'custom.2');

  return (
    <Collapse in={collapse} unmountOnExit={true}>
      <Box bg={bg} pt={4} px={5} pb={5} mb={5} borderRadius="xl" {...props}>
        <Flex direction="row" justifyContent="space-between" mb={2}>
          <Box as="h3" fontSize="lg" fontWeight="bold" color={titleColor}>
            {title}
          </Box>
          <Tooltip label="Close">
            <CloseButton size="sm" variant="rounded" onClick={handleClose} />
          </Tooltip>
        </Flex>
        {children}
      </Box>
    </Collapse>
  );
};
