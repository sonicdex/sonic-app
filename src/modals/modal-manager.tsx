import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
} from '@chakra-ui/react';

import { useAppSelector, selectModalState, useModalStore } from '@/store';
import { MODALS } from './modals';
import { SwapProgress, SwapFailed } from './contents';

const MODAL_MAPPING = {
  [MODALS.swapProgress]: SwapProgress,
  [MODALS.swapFailed]: SwapFailed,
};

export const ModalManager = () => {
  const { clearModal } = useModalStore();

  const {
    currentModal,
    currentModalState,
    currentModalData,
    callbacks,
    onClose,
  } = useAppSelector(selectModalState);

  const ModalComponent = MODAL_MAPPING[currentModal];
  const shouldOpen = currentModal?.length > 0;

  const handleOnClose = () => {
    clearModal();
    onClose();
  };

  return (
    <Modal isOpen={shouldOpen} onClose={handleOnClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="20px" width="fit-content">
        {ModalComponent && (
          <ModalComponent
            currentModalState={currentModalState}
            currentModalData={currentModalData}
            callbacks={callbacks}
          />
        )}
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
};
