import { HStack, Modal, ModalOverlay } from '@chakra-ui/react';

import { TransactionProgressModalContent, TransactionStep } from './components';
import {
  modalsSliceActions,
  UnwrapModalDataStep,
  useAppDispatch,
  useModalsStore,
} from '@/store';
import { withdrawSrc } from '@/assets';
import { useStepStatus } from '.';

export const UnwrapProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isUnwrapProgressModalOpened, unwrapModalData } = useModalsStore();
  const { steps, step: activeStep } = unwrapModalData;

  const getStepStatus = useStepStatus<UnwrapModalDataStep>({
    activeStep,
    steps,
  });

  const handleClose = () => {
    dispatch(modalsSliceActions.closeUnwrapProgressModal());
  };

  return (
    <Modal
      onClose={handleClose}
      isOpen={isUnwrapProgressModalOpened}
      isCentered
    >
      <ModalOverlay />
      <TransactionProgressModalContent title="Unwrapping ICP">
        <HStack>
          <TransactionStep
            status={getStepStatus(UnwrapModalDataStep.WithdrawWICP)}
            iconSrc={withdrawSrc}
          >
            Unwrapping the ICP
          </TransactionStep>
        </HStack>
      </TransactionProgressModalContent>
    </Modal>
  );
};
