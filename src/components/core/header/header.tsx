import {
  Box,
  Button,
  Divider,
  Flex,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { useState } from 'react';

import { useHeaderResizeEffect } from '@/hooks';

type HeaderProps = {
  title: string;
  buttonText?: string;
  onButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
  isUpdating?: boolean;
};

export const Header: React.FC<HeaderProps> = ({
  title,
  buttonText,
  onButtonClick,
  isUpdating,
  children,
}) => {
  const [top, setTop] = useState('116px');
  const paddingToLine = buttonText && onButtonClick ? '17px' : '24px';
  const marginTop = buttonText && onButtonClick ? '-8px' : '0px';

  const color = useColorModeValue('gray.800', 'gray.50');
  const backgroundColor = useColorModeValue('custom.5', 'black');

  useHeaderResizeEffect((element) => {
    setTop(`${element.clientHeight - 1}px`);
  });

  return (
    <Flex
      position="sticky"
      top={top}
      pt={5}
      mt={-10}
      mb={5}
      backgroundColor={backgroundColor}
      transition="background-color 200ms"
      zIndex={1}
      flexDirection="column"
    >
      {children}
      <Flex
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        pb={paddingToLine}
        mt={marginTop}
      >
        <Box as="h3" fontWeight={700} color={color}>
          {title}
          {isUpdating && <Spinner width={3} height={3} mx={3} />}
        </Box>
        {buttonText && onButtonClick && (
          <Button
            variant="gradient"
            colorScheme="dark-blue"
            onClick={onButtonClick}
          >
            {buttonText}
          </Button>
        )}
      </Flex>
      <Divider />
    </Flex>
  );
};
