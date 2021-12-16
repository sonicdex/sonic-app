import { useModalsStore } from '@/store';
import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react';
import {
  TransactionFailed,
  TransactionProgress,
  TokenSelect,
} from './contents';
import { Modals } from './modals';

const MODAL_MAPPING = {
  [Modals.AddLiquidity]: TransactionProgress,
  [Modals.Deposit]: TransactionProgress,
  [Modals.Withdraw]: TransactionProgress,
  [Modals.RemoveLiquidity]: TransactionProgress,

  [Modals.SwapProgress]: TransactionProgress,
  [Modals.SwapFailed]: TransactionFailed,

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
  } = useModalsStore();

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
