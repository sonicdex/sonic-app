import {
  Flex,
  Heading,
  ModalCloseButton,
  ModalContent,
  Text,
} from '@chakra-ui/react';
import React from 'react';

type TransactionFailedModalContentProps = {
  title: string;
};

export const TransactionFailedModalContent: React.FC<
  TransactionFailedModalContentProps
> = ({ title, children }) => (
  <ModalContent
    as={Flex}
    alignItems="center"
    direction="column"
    justifyContent="center"
    borderRadius={20}
    bg="custom.2"
    pt={9}
    px={5}
    pb={9}
  >
    <ModalCloseButton position="absolute" top={3} right={4} />
    <Heading as="h1" fontWeight={700} fontSize={22} pb={3}>
      {title}
    </Heading>
    <Text as="p" pb={6} color="custom.1">
      Please choose an option below
    </Text>
    {children}
  </ModalContent>
);
