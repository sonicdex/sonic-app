import {
  Flex,
  Heading,
  ModalCloseButton,
  ModalContent,
  ModalContentProps,
  Text,
} from '@chakra-ui/react';
import React from 'react';

export type TransactionProgressModalContentProps = {
  title: string;
  token0Symbol: string;
  token1Symbol: string;
  type: 'deposit' | 'swap' | 'withdraw' | '';
};

export const TransactionProgressModalContent: React.FC<ModalContentProps> = ({
  children,
  title,
  ...props
}) => {
  return (
    <ModalContent
      as={Flex}
      direction="column"
      alignItems="center"
      bg="custom.2"
      pt="37px"
      px="37px"
      pb="43px"
      borderRadius={20}
      {...props}
      minWidth="fit-content"
    >
      <ModalCloseButton />
      <Heading as="h1" color="gray.50" fontWeight={700} fontSize={22} mb={3}>
        {title}
      </Heading>
      <Text as="p" color="custom.1" mb="33px">
        Please wait some time for transactions to finish
      </Text>
      <Flex direction="row" justifyContent="center">
        {children}
      </Flex>
    </ModalContent>
  );
};
