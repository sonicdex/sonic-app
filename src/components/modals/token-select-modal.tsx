import { useModalsStore } from '@/store';
import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react';
import React from 'react';

export const TokenSelectModal = () => {
  const {} = useModalsStore();

  return (
    <Modal isOpen={Boolean(currentModal)} onClose={handleOnClose} isCentered>
      <ModalOverlay />
      <ModalContent></ModalContent>
    </Modal>
  );
};
