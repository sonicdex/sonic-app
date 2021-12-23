import { Modal, ModalOverlay } from '@chakra-ui/react';
import { Button } from '../core';

import { TransactionFailedModalContent } from './components';
import { modalsSliceActions, useAppDispatch, useModalsStore } from '@/store';

export const AddLiquidityFailModal = () => {
  const { isAddLiquidityFailOpened, addLiquidityData } = useModalsStore();
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
          isWireframe
        >
          Close
        </Button>
      </TransactionFailedModalContent>
    </Modal>
  );
};
