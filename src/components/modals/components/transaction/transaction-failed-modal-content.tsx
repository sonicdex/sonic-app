import {
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

type TransactionFailedModalProps = ModalProps & {
  title: string;
};

export const TransactionFailedModal: React.FC<TransactionFailedModalProps> = ({
  title,
  children,
  ...modalProps
}) => {
  const bg = useColorModeValue('gray.50', 'custom.2');
  const color = useColorModeValue('gray.600', 'gray.400');

  return (
    <Modal {...modalProps}>
      <ModalOverlay />
      <ModalContent textAlign="center" borderRadius={20} bg={bg}>
        <ModalHeader>
          <Heading as="h2" fontWeight={700} fontSize="1.375rem">
            {title}
          </Heading>
        </ModalHeader>
        <ModalBody>
          <Text color={color}>Please choose an option below</Text>
        </ModalBody>
        <ModalFooter as={HStack}>{children}</ModalFooter>
      </ModalContent>
    </Modal>
  );
};
