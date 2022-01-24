import {
  Box,
  Button,
  Divider,
  Flex,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

type HeaderProps = {
  title: string;
  buttonText?: string;
  onButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
  isRefreshing?: boolean;
};

export const Header: React.FC<HeaderProps> = ({
  title,
  buttonText,
  onButtonClick,
  isRefreshing,
  children,
}) => {
  const paddingToLine = buttonText && onButtonClick ? '17px' : '24px';
  const marginTop = buttonText && onButtonClick ? '-8px' : '0px';

  const color = useColorModeValue('gray.800', 'gray.50');
  const backgroundColor = useColorModeValue('dark-blue.50', 'black');

  return (
    <Flex
      position="sticky"
      top="116px"
      pt={5}
      mt={-10}
      mb={5}
      backgroundColor={backgroundColor}
      transition="background 200ms"
      zIndex={10}
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
          {isRefreshing && <Spinner width={3} height={3} mx={3} />}
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
