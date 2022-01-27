import {
  Flex,
  Heading,
  ModalCloseButton,
  ModalContent,
  ModalContentProps,
  Text,
  useColorModeValue,
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
  const bg = useColorModeValue('gray.50', 'custom.2');
  const color = useColorModeValue('gray.600', 'custom.1');

  const titleColor = useColorModeValue('gray.800', 'gray.50');

  return (
    <ModalContent
      as={Flex}
      direction="column"
      alignItems="center"
      bg={bg}
      pt="37px"
      px="37px"
      pb="43px"
      borderRadius={20}
      {...props}
      minWidth="fit-content"
    >
      <ModalCloseButton />
      <Heading as="h1" color={titleColor} fontWeight={700} fontSize={22} mb={3}>
        {title}
      </Heading>
      <Text as="p" color={color} mb="33px">
        Please wait some time for transactions to finish
      </Text>
      <Flex direction="row" justifyContent="center">
        {children}
      </Flex>
    </ModalContent>
  );
};
