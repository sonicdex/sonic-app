import {
  Flex,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
} from '@chakra-ui/react';

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
    <ModalContent bg="#1E1E1E" borderRadius="20px">
      <ModalBody pt="37px" px="73px" pb="35px">
        <Box
          position="absolute"
          top="20px"
          right="20px"
          width="20px"
          as="img"
          src={'/assets/close.svg'}
          onClick={onClose}
          cursor="pointer"
        />
        <Flex direction="column" alignItems="center">
          <Box as="h3" color="#F6FCFD" fontWeight={700} fontSize="22px">
            Waiting for confirmation
          </Box>
          <Box as="p" color="#888E8F" fontSize="16px" mt="13px" mb="20px">
            Please confirm this transaction in Plug
          </Box>
          <Box width="95px" as="img" src={'/assets/logo.png'} />
        </Flex>
      </ModalBody>
    </ModalContent>
  </Modal>
);
