import { Button, Modal, ModalOverlay } from '@chakra-ui/react';

import { TransactionFailedModalContent } from './components';
import { useModalsStore } from '@/store';

export const AddLiquidityFailModal = () => {
  const { isAddLiquidityFailOpened, addLiquidityData } = useModalsStore();
  const { callbacks: [addLiquidityCallback, closeCallback] = [] } =
    addLiquidityData;

  return (
    <Modal
      onClose={closeCallback ?? (() => null)}
      isOpen={isAddLiquidityFailOpened}
      isCentered
    >
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
