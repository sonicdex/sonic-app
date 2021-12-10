import { UseDisclosureReturn } from '@chakra-ui/hooks';
import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/modal';

type RemoveLiquidityModalProps = UseDisclosureReturn;

export const RemoveLiquidityModal = ({
  isOpen,
  onClose,
}: RemoveLiquidityModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>123</ModalContent>
    </Modal>
  );
};
