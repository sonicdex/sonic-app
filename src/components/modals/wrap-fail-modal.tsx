import { Button } from '@chakra-ui/react';

import { modalsSliceActions, useAppDispatch, useModalsStore } from '@/store';

import { TransactionFailedModal } from './components';

export const WrapFailModal = () => {
  const { isWrapFailModalOpened, wrapModalData } = useModalsStore();
  const { callbacks: [retryCallback, closeCallback] = [] } = wrapModalData;

  const dispatch = useAppDispatch();

  const handleClose = () => {
    if (closeCallback) closeCallback();
    dispatch(modalsSliceActions.closeWrapFailModal());
  };

  return (
    <TransactionFailedModal
      onClose={handleClose}
      isOpen={isWrapFailModalOpened}
      isCentered
      title="Wrap ICP Failed"
    >
      <Button
        variant="gradient"
        colorScheme="dark-blue"
        borderRadius={12}
        fontWeight={700}
        fontSize={18}
        onClick={retryCallback}
        isFullWidth
      >
        Retry
      </Button>
      <Button
        borderRadius={12}
        fontWeight={700}
        fontSize={18}
        onClick={handleClose}
        isFullWidth
      >
        Later
      </Button>
    </TransactionFailedModal>
  );
};
