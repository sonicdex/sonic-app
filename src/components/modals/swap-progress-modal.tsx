import { Modal, ModalOverlay } from '@chakra-ui/react';

import { TransactionProgressModalContent } from './components';
import { modalsSliceActions, useAppDispatch, useModalsStore } from '@/store';

export const SwapProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isSwapProgressOpened } = useModalsStore();

  const handleClose = () => {
    dispatch(modalsSliceActions.closeSwapProgressModal);
  };

  return (
    <Modal onClose={handleClose} isOpen={isSwapProgressOpened} isCentered>
      <ModalOverlay />
      <TransactionProgressModalContent />
    </Modal>
  );
};
