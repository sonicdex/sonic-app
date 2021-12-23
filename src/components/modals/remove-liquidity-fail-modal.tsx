import { Modal, ModalOverlay } from '@chakra-ui/react';
import { Button } from '../core';

import { TransactionFailedModalContent } from './components';
import { modalsSliceActions, useAppDispatch, useModalsStore } from '@/store';

export const RemoveLiquidityFailModal = () => {
  const { isRemoveLiquidityFailOpened, removeLiquidityData } = useModalsStore();
  const { callbacks: [removeLiquidityCallback, closeCallback] = [] } =
    removeLiquidityData;

  const dispatch = useAppDispatch();

  const handleClose = () => {
    if (closeCallback) closeCallback();
    dispatch(modalsSliceActions.closeRemoveLiquidityFailModal());
  };

  return (
    <Modal
      onClose={handleClose}
      isOpen={isRemoveLiquidityFailOpened}
      isCentered
    >
      <ModalOverlay />
      <TransactionFailedModalContent title="Swap Failed">
        <Button
          borderRadius={12}
          fontWeight={700}
          fontSize={18}
          onClick={removeLiquidityCallback}
          isFullWidth
          mb={4}
        >
          Retry removing the liquidity
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
