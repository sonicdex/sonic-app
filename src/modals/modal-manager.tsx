import { useModalStore } from '@/store';
import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react';
import { SwapFailed, SwapProgress, TokenSelect } from './contents';
import { MODALS } from './modals';

const MODAL_MAPPING = {
  [MODALS.swapProgress]: SwapProgress,
  [MODALS.swapFailed]: SwapFailed,
  [MODALS.tokenSelect]: TokenSelect,
};

export const ModalManager = () => {
  const {
    clearModal,
    currentModal,
    currentModalData,
    currentModalState,
    onClose,
    callbacks,
  } = useModalStore();

  const ModalComponent = MODAL_MAPPING[currentModal];
  const shouldOpen = currentModal?.length > 0;

  const handleOnClose = () => {
    clearModal();
    onClose();
  };

  return (
    <Modal isOpen={shouldOpen} onClose={handleOnClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="20px">
        {ModalComponent && (
          <ModalComponent
            currentModalState={currentModalState}
            currentModalData={currentModalData}
            callbacks={callbacks}
            onClose={handleOnClose}
          />
        )}
      </ModalContent>
    </Modal>
  );
};
