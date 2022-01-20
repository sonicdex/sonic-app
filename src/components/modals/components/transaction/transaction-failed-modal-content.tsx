import {
  Flex,
  Heading,
  ModalCloseButton,
  ModalContent,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

type TransactionFailedModalContentProps = {
  title: string;
};

export const TransactionFailedModalContent: React.FC<
  TransactionFailedModalContentProps
> = ({ title, children }) => {
  const bg = useColorModeValue('gray.50', 'custom.2');
  const color = useColorModeValue('gray.600', 'custom.1');

  return (
    <ModalContent
      as={Flex}
      alignItems="center"
      direction="column"
      justifyContent="center"
      borderRadius={20}
      bg={bg}
      pt={9}
      px={5}
      pb={9}
    >
      <ModalCloseButton position="absolute" top={3} right={4} />
      <Heading as="h1" fontWeight={700} fontSize={22} pb={3}>
        {title}
      </Heading>
      <Text as="p" pb={6} color={color}>
        Please choose an option below
      </Text>
      {children}
    </ModalContent>
  );
};
