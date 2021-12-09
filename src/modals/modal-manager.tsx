import { Modal, ModalOverlay, ModalContent } from '@chakra-ui/react';

import { useAppSelector, selectModalState, useModalStore } from '@/store';
import { MODALS } from './modals';
import { SwapProgress, SwapFailed, TokenSelect } from './contents';

const MODAL_MAPPING = {
  [MODALS.swapProgress]: SwapProgress,
  [MODALS.swapFailed]: SwapFailed,
  [MODALS.tokenSelect]: TokenSelect,
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
    const callableOnClose = new Function(`return ${onClose}`);
    clearModal();
    callableOnClose();
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
