import { Button } from '@chakra-ui/react';

import { modalsSliceActions, useAppDispatch, useModalsStore } from '@/store';

import { TransactionFailedModal } from './components';

export const UnwrapFailModal = () => {
  const { isUnwrapFailModalOpened, unwrapModalData } = useModalsStore();
  const { callbacks: [retryCallback, closeCallback] = [] } = unwrapModalData;

  const dispatch = useAppDispatch();

  const handleClose = () => {
    if (closeCallback) closeCallback();
    dispatch(modalsSliceActions.closeUnwrapFailModal());
  };

  return (
    <TransactionFailedModal
      onClose={handleClose}
      isOpen={isUnwrapFailModalOpened}
      isCentered
      title="Unwrap ICP Failed"
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
