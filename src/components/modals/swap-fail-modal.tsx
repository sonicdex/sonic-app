import { Button, Modal, ModalOverlay } from '@chakra-ui/react';

import { TransactionFailedModalContent } from './components';
import { modalsSliceActions, useAppDispatch, useModalsStore } from '@/store';

export const SwapFailModal = () => {
  const dispatch = useAppDispatch();
  const { isSwapFailModalOpened: isSwapFailOpened, swapModalData: swapData } =
    useModalsStore();
  const { callbacks: [retryCallback, withdrawCallback, closeCallback] = [] } =
    swapData;

  const handleClose = () => {
    if (closeCallback) closeCallback();
    dispatch(modalsSliceActions.closeSwapFailModal());
  };

  return (
    <Modal onClose={handleClose} isOpen={isSwapFailOpened} isCentered>
      <ModalOverlay />
      <TransactionFailedModalContent title="Swap Failed">
        <Button
          variant="gradient"
          colorScheme="dark-blue"
          borderRadius={12}
          fontWeight={700}
          fontSize={18}
          onClick={retryCallback}
          isFullWidth
          mb={4}
        >
          Retry Swap
        </Button>
        <Button
          borderRadius={12}
          fontWeight={700}
          fontSize={18}
          onClick={withdrawCallback}
          isFullWidth
        >
          Withdraw to Plug
        </Button>
      </TransactionFailedModalContent>
    </Modal>
  );
};
