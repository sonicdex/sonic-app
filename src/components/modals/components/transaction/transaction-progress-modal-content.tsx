import {
  Flex,
  Heading,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalProps,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

export type TransactionProgressModalProps = ModalProps & {
  title: string;
};

export const TransactionProgressModal: React.FC<
  TransactionProgressModalProps
> = ({ children, title, ...props }) => {
  const bg = useColorModeValue('gray.50', 'custom.2');
  const color = useColorModeValue('gray.600', 'custom.1');

  const titleColor = useColorModeValue('gray.800', 'gray.50');

  return (
    <Modal {...props}>
      <ModalOverlay />
      <ModalContent
        as={Flex}
        direction="column"
        alignItems="center"
        bg={bg}
        pt="37px"
        px="37px"
        pb="43px"
        borderRadius={20}
        minWidth={['unset', 'fit-content', 'fit-content']}
      >
        <ModalCloseButton />
        <Heading
          as="h1"
          color={titleColor}
          fontWeight={700}
          fontSize="1.375rem"
          mb={3}
        >
          {title}
        </Heading>
        <Text as="p" color={color} mb="2.06rem">
          Please wait some time for transactions to finish
        </Text>
        <Flex
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
          flexWrap="wrap"
          rowGap={4}
        >
          {children}
        </Flex>
      </ModalContent>
    </Modal>
  );
};
