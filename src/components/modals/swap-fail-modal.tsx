import { Button, Modal, ModalOverlay } from '@chakra-ui/react';

import { TransactionFailedModalContent } from './components';
import { modalsSliceActions, useAppDispatch, useModalsStore } from '@/store';

export const SwapProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isSwapProgressOpened, swapData } = useModalsStore();
  const { callbacks } = swapData;

  const handleClose = () => {
    dispatch(modalsSliceActions.closeSwapProgressModal);
  };

  return (
    <Modal onClose={handleClose} isOpen={isSwapProgressOpened} isCentered>
      <ModalOverlay />
      <TransactionFailedModalContent title="Swap Failed">
        <Button
          borderRadius={12}
          fontWeight={700}
          fontSize={18}
          onClick={callbacks?.[0]}
          width="100%"
          mb={4}
        >
          Retry Swap
        </Button>
        <Button
          borderRadius={12}
          fontWeight={700}
          fontSize={18}
          onClick={callbacks?.[1]}
          width="100%"
          isWireframe
        >
          Withdraw to Plug
        </Button>
      </TransactionFailedModalContent>
    </Modal>
  );
};
