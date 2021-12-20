import {
  Heading,
  Text,
  Flex,
  ModalContent,
  ModalContentProps,
  ModalCloseButton,
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
      bg="#1E1E1E"
      pt="37px"
      px="37px"
      pb="43px"
      borderRadius={20}
      {...props}
    >
      <ModalCloseButton />
      <Heading as="h1" color="#F6FCFD" fontWeight={700} fontSize={22} mb={3}>
        {title}
      </Heading>
      <Text as="p" color="#888E8F" mb="33px">
        Please wait some time for transactions to finish
      </Text>
      <Flex direction="row" justifyContent="center">
        {children}
      </Flex>
    </ModalContent>
  );
};
