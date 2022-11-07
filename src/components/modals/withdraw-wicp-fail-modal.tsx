import { Button } from '@chakra-ui/react';

import { modalsSliceActions, useAppDispatch, useModalsStore } from '@/store';

import { TransactionFailedModal } from './components';

export const WithdrawWICPFailModal = () => {
  const { isWithdrawWICPFailModalOpened, withdrawWICPModalData } =
    useModalsStore();
  const { callbacks: [retryCallback, closeCallback] = [] } =
    withdrawWICPModalData;

  const dispatch = useAppDispatch();

  const handleClose = () => {
    if (closeCallback) closeCallback();
    dispatch(modalsSliceActions.closeWithdrawWICPFailModal());
  };

  return (
    <TransactionFailedModal
      onClose={handleClose}
      isOpen={isWithdrawWICPFailModalOpened}
      isCentered
      title="ICP Unwrapping Failed"
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
