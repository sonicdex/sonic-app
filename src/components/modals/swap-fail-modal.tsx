import { Button } from '@chakra-ui/react';

import { modalsSliceActions, useAppDispatch, useModalsStore } from '@/store';

import { TransactionFailedModal } from './components';

export const SwapFailModal = () => {
  const dispatch = useAppDispatch();
  const { isSwapFailModalOpened, swapModalData } = useModalsStore();
  const { callbacks: [retryCallback, withdrawCallback, closeCallback] = [] } =
    swapModalData;

  const handleClose = () => {
    if (closeCallback) closeCallback();
    dispatch(modalsSliceActions.closeSwapFailModal());
  };

  return (
    <TransactionFailedModal
      onClose={handleClose}
      isOpen={isSwapFailModalOpened}
      isCentered
      title="Swap Failed"
    >
      <Button
        variant="gradient"
        colorScheme="dark-blue"
        borderRadius={12}
        fontWeight={700}
        fontSize="1.125rem"
        onClick={retryCallback}
        isFullWidth
      >
        Retry Swap
      </Button>
      <Button
        borderRadius={12}
        fontWeight={700}
        fontSize="1.125rem"
        onClick={withdrawCallback}
        isFullWidth
      >
        Withdraw to Plug
      </Button>
    </TransactionFailedModal>
  );
};
