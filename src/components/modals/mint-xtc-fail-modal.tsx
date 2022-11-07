import { Button } from '@chakra-ui/react';

import { modalsSliceActions, useAppDispatch, useModalsStore } from '@/store';

import { TransactionFailedModal } from './components';

export const MintXTCFailModal = () => {
  const {
    isMintXTCFailModalOpened: isRemoveLiquidityFailOpened,
    mintXTCModalData,
  } = useModalsStore();
  const { callbacks: [retryCallback, closeCallback] = [] } = mintXTCModalData;

  const dispatch = useAppDispatch();

  const handleClose = () => {
    if (closeCallback) closeCallback();
    dispatch(modalsSliceActions.closeMintXTCFailModal());
  };

  return (
    <TransactionFailedModal
      onClose={handleClose}
      isOpen={isRemoveLiquidityFailOpened}
      isCentered
      title="Mint XTC Failed"
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
