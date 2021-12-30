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
  const {
    isUnwrapProgressModalOpened: isUnwrapProgressOpened,
    unwrapModalData: unwrapData,
  } = useModalsStore();
  const { steps, step: activeStep } = unwrapData;

  const getStepStatus = useStepStatus<UnwrapModalDataStep>({
    activeStep,
    steps,
  });

  const handleClose = () => {
    dispatch(modalsSliceActions.closeUnwrapProgressModal());
  };

  return (
    <Modal onClose={handleClose} isOpen={isUnwrapProgressOpened} isCentered>
      <ModalOverlay />
      <TransactionProgressModalContent title="Unwrapping ICP in Progress">
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
