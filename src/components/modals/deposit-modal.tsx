import { HStack, Modal, ModalOverlay } from '@chakra-ui/react';

import { TransactionProgressModalContent, TransactionStep } from './components';
import {
  DepositModalDataStep,
  modalsSliceActions,
  useAppDispatch,
  useModalsStore,
} from '@/store';
import { checkPlainSrc, depositSrc } from '@/assets';

export const DepositProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isDepositProgressOpened, depositData } = useModalsStore();
  const { steps, tokenSymbol, step: activeStep } = depositData;

  const handleClose = () => {
    dispatch(modalsSliceActions.closeDepositProgressModal());
  };

  const getStepStatus = (step: DepositModalDataStep) => {
    if (activeStep) {
      const currentStepIndex = steps?.indexOf(activeStep);
      const stepIndex = steps?.indexOf(step);

      if (currentStepIndex! > stepIndex!) return 'done';
      if (currentStepIndex === stepIndex) return 'active';
    }

    return 'disabled';
  };

  return (
    <Modal onClose={handleClose} isOpen={isDepositProgressOpened} isCentered>
      <ModalOverlay />
      <TransactionProgressModalContent title="Deposit in Progress">
        <HStack>
          <TransactionStep
            status={getStepStatus('approve')}
            iconSrc={checkPlainSrc}
            chevron
          >
            Approving usage <br /> {tokenSymbol}
          </TransactionStep>
          <TransactionStep
            status={getStepStatus('deposit')}
            iconSrc={depositSrc}
          >
            Depositing <br /> {tokenSymbol}
          </TransactionStep>
        </HStack>
      </TransactionProgressModalContent>
    </Modal>
  );
};
