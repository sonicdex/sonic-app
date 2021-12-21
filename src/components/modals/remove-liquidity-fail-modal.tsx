import { Button, Modal, ModalOverlay } from '@chakra-ui/react';

import { TransactionFailedModalContent } from './components';
import { useModalsStore } from '@/store';

export const RemoveLiquidityFailModal = () => {
  const { isRemoveLiquidityFailOpened, removeLiquidityData } = useModalsStore();
  const { callbacks: [removeLiquidityCallback, closeCallback] = [] } =
    removeLiquidityData;

  return (
    <Modal
      onClose={closeCallback ?? (() => null)}
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
          onClick={closeCallback}
          isFullWidth
          isWireframe
        >
          Close
        </Button>
      </TransactionFailedModalContent>
    </Modal>
  );
};
