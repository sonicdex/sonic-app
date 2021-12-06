import {
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Image,
  Heading,
  Text,
} from '@chakra-ui/react';

import { logoSrc, closeSrc } from '@/assets';

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
    <ModalContent bg="#1E1E1E" borderRadius={5}>
      <ModalBody pt={9} px={18} pb={9}>
        <Image
          position="absolute"
          top={5}
          right={5}
          width={5}
          src={closeSrc}
          onClick={onClose}
          cursor="pointer"
        />
        <Flex direction="column" alignItems="center">
          <Heading as="h3" color="#F6FCFD" fontWeight={700} fontSize="md">
            Waiting for confirmation
          </Heading>
          <Text color="#888E8F" fontSize="md" mt={3} mb={5}>
            Please confirm this transaction in Plug
          </Text>
          <Image width={24} src={logoSrc} />
        </Flex>
      </ModalBody>
    </ModalContent>
  </Modal>
);
