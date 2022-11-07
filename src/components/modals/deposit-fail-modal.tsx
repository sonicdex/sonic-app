import { Button } from '@chakra-ui/react';

import { modalsSliceActions, useAppDispatch, useModalsStore } from '@/store';

import { TransactionFailedModal } from './components';

export const DepositFailModal = () => {
  const { isDepositFailModalOpened, depositModalData } = useModalsStore();
  const { callbacks: [retryCallback, closeCallback] = [] } = depositModalData;

  const dispatch = useAppDispatch();

  const handleClose = () => {
    if (closeCallback) closeCallback();
    dispatch(modalsSliceActions.closeDepositFailModal());
  };

  return (
    <TransactionFailedModal
      onClose={handleClose}
      isOpen={isDepositFailModalOpened}
      isCentered
      title="Deposit Failed"
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
        Retry
      </Button>
      <Button
        borderRadius={12}
        fontWeight={700}
        fontSize="1.125rem"
        onClick={handleClose}
        isFullWidth
      >
        Later
      </Button>
    </TransactionFailedModal>
  );
};
