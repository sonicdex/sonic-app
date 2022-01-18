import { Box, Button, Flex, Spinner } from '@chakra-ui/react';
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

  return (
    <Flex
      position="sticky"
      top="116px"
      pt={5}
      mt={-10}
      mb={5}
      backgroundColor="black"
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
        borderBottom="1px solid"
        borderColor="custom.3"
      >
        <Box as="h3" fontWeight={700} color="gray.50">
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
    </Flex>
  );
};
