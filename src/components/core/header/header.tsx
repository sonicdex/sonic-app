import { Box, Button, Flex, Spinner } from '@chakra-ui/react';
import React from 'react';

type HeaderProps = {
  title: string;
  buttonText?: string;
  onButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
  isRefreshing?: boolean;
  children?: React.ReactNode;
};

export const Header = ({
  title,
  buttonText,
  onButtonClick,
  isRefreshing,
  children,
}: HeaderProps) => {
  const paddingToLine = buttonText && onButtonClick ? '17px' : '24px';
  const marginTop = buttonText && onButtonClick ? '-8px' : '0px';

  return (
    <Flex
      position="sticky"
      top="116px"
      pt={10}
      mt={-10}
      mb={5}
      backgroundColor="bg"
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
        borderBottom="1px solid #373737"
      >
        <Box as="h3" fontWeight={700} color="#F6FCFD">
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
