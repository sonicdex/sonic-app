import { Button, Modal, ModalOverlay } from '@chakra-ui/react';

import { modalsSliceActions, useAppDispatch, useModalsStore } from '@/store';

import { TransactionFailedModalContent } from './components';

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
    <Modal onClose={handleClose} isOpen={isAddLiquidityFailOpened} isCentered>
      <ModalOverlay />
      <TransactionFailedModalContent title="Swap Failed">
        <Button
          variant="gradient"
          colorScheme="dark-blue"
          borderRadius={12}
          fontWeight={700}
          fontSize={18}
          onClick={addLiquidityCallback}
          isFullWidth
          mb={4}
        >
          Retry adding the liquidity
        </Button>
        <Button
          borderRadius={12}
          fontWeight={700}
          fontSize={18}
          onClick={handleClose}
          isFullWidth
        >
          Close
        </Button>
      </TransactionFailedModalContent>
    </Modal>
  );
};
