import { HStack, Modal, ModalOverlay } from '@chakra-ui/react';

import { TransactionProgressModalContent, TransactionStep } from './components';
import {
  modalsSliceActions,
  UnwrapModalDataStep,
  useAppDispatch,
  useModalsStore,
} from '@/store';
import { withdrawSrc } from '@/assets';

export const UnwrapProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isUnwrapProgressOpened, unwrapData } = useModalsStore();
  const { steps, step: activeStep } = unwrapData;

  const handleClose = () => {
    dispatch(modalsSliceActions.closeUnwrapProgressModal());
  };

  const getStepStatus = (step: UnwrapModalDataStep) => {
    if (activeStep) {
      const currentStepIndex = steps?.indexOf(activeStep);
      const stepIndex = steps?.indexOf(step);

      if (currentStepIndex! > stepIndex!) return 'done';
      if (currentStepIndex === stepIndex) return 'active';
    }

    return 'disabled';
  };

  return (
    <Modal onClose={handleClose} isOpen={isUnwrapProgressOpened} isCentered>
      <ModalOverlay />
      <TransactionProgressModalContent title="Unwrapping ICP in Progress">
        <HStack>
          <TransactionStep
            status={getStepStatus('withdrawWICP')}
            iconSrc={withdrawSrc}
          >
            Unwrapping the ICP
          </TransactionStep>
        </HStack>
      </TransactionProgressModalContent>
    </Modal>
  );
};
