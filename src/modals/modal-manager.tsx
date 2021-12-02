import {
  Modal,
  ModalOverlay,
  ModalContent,
} from '@chakra-ui/react';

import { useAppSelector, selectModalState } from '@/store';
import { MODALS } from './modals';
import { SwapProgress } from './contents';

const MODAL_MAPPING = {
  [MODALS.swapProgress]: SwapProgress,
};

export const ModalManager = () => {
  const {
    currentModal,
    currentModalState,
    currentModalData,
  } = useAppSelector(selectModalState);

  const ModalComponent = MODAL_MAPPING[currentModal];
  const shouldOpen = currentModal && currentModal.length > 0;

  return (
    <Modal
      isOpen={shouldOpen}
      onClose={() => {}}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        borderRadius="20px"
        width="fit-content"
      >
        { ModalComponent && (
          <ModalComponent
            currentModalState={currentModalState}
            currentModalData={currentModalData}
          />
        )}
      </ModalContent>
    </Modal>
  );
}
