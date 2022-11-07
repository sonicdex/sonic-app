import { Button } from '@chakra-ui/react';

import { modalsSliceActions, useAppDispatch, useModalsStore } from '@/store';

import { TransactionFailedModal } from './components';

export const AddLiquidityFailModal = () => {
  const {
    isAddLiquidityFailModalOpened: isAddLiquidityFailOpened,
    addLiquidityModalData: addLiquidityData,
  } = useModalsStore();
  const { callbacks: [addLiquidityCallback, closeCallback] = [] } =
    addLiquidityData;

  const dispatch = useAppDispatch();

  const handleClose = () => {
    if (closeCallback) closeCallback();
    dispatch(modalsSliceActions.closeAddLiquidityFailModal());
  };

  return (
    <TransactionFailedModal
      onClose={handleClose}
      isOpen={isAddLiquidityFailOpened}
      isCentered
      title="Add Liquidity Failed"
    >
      <Button
        variant="gradient"
        colorScheme="dark-blue"
        borderRadius={12}
        fontWeight={700}
        fontSize="1.125rem"
        onClick={addLiquidityCallback}
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
        Close
      </Button>
    </TransactionFailedModal>
  );
};
