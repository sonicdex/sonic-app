import { useModalStore } from '@/store';
import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react';
import { SwapFailed, SwapProgress, TokenSelect } from './contents';
import { Modals } from './modals';

const MODAL_MAPPING = {
  [Modals.AddLiquidity]: SwapProgress,
  [Modals.Deposit]: SwapProgress,
  [Modals.Withdraw]: SwapProgress,
  [Modals.RemoveLiquidity]: SwapProgress,
  [Modals.SwapProgress]: SwapProgress,
  [Modals.SwapFailed]: SwapFailed,
  [Modals.TokenSelect]: TokenSelect,
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

  const ModalComponent = currentModal ? MODAL_MAPPING[currentModal] : null;

  const handleOnClose = () => {
    clearModal();
    onClose();
  };

  return (
    <Modal isOpen={Boolean(currentModal)} onClose={handleOnClose} isCentered>
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
