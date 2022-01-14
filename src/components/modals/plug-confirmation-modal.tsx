import {
  Flex,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';

import { closeSrc, logoSrc } from '@/assets';

type PlugConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => any;
};

export const PlugConfirmationModal = ({
  isOpen,
  onClose,
}: PlugConfirmationModalProps) => (
  <Modal onClose={onClose} isOpen={isOpen} isCentered>
    <ModalOverlay />
    <ModalContent bg="custom.2" borderRadius={5}>
      <ModalBody pt={9} px={18} pb={9}>
        <Image
          position="absolute"
          top={5}
          right={5}
          width={5}
          src={closeSrc}
          onClick={onClose}
          cursor="pointer"
          alt="close"
        />
        <Flex direction="column" alignItems="center">
          <Heading as="h3" color="gray.50" fontWeight={700} fontSize="md">
            Waiting for confirmation
          </Heading>
          <Text color="custom.1" fontSize="md" mt={3} mb={5}>
            Please confirm this transaction in Plug
          </Text>
          <Image width={24} src={logoSrc} alt="Sonic" />
        </Flex>
      </ModalBody>
    </ModalContent>
  </Modal>
);
