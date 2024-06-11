import { Button } from '@chakra-ui/react';

import { modalsSliceActions, useAppDispatch, useModalsStore } from '@/store';

import { TransactionFailedModal } from './components';

export const MintWICPFailModal = () => {
  const { isMintWICPFailModalOpened, mintWICPModalData } = useModalsStore();
  const { callbacks: [retryCallback, closeCallback] = [] } = mintWICPModalData;

  const dispatch = useAppDispatch();

  const handleClose = () => {
    if (closeCallback) closeCallback();
    dispatch(modalsSliceActions.closeMintWICPFailModal());
  };

  return (
    <TransactionFailedModal
      onClose={handleClose}
      isOpen={isMintWICPFailModalOpened}
      isCentered
      title="ICP Wrapping Failed"
    >
      <Button
        variant="gradient"
        colorScheme="green"
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
