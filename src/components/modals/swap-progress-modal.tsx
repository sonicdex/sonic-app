import { Modal, ModalOverlay } from '@chakra-ui/react';

import { TransactionProgressModalContent, TransactionStep } from './components';
import {
  modalsSliceActions,
  SwapModalDataStep,
  useAppDispatch,
  useModalsStore,
} from '@/store';
import { depositSrc, swapSrc, withdrawSrc } from '@/assets';

export const SwapProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isSwapProgressOpened, swapData } = useModalsStore();
  const { steps, fromTokenSymbol, toTokenSymbol, step: activeStep } = swapData;

  const handleClose = () => {
    dispatch(modalsSliceActions.closeSwapProgressModal);
  };

  const getStepStatus = (step: SwapModalDataStep) => {
    if (activeStep) {
      const currentStepIndex = steps?.indexOf(activeStep);
      const stepIndex = steps?.indexOf(step);

      if (!currentStepIndex || !stepIndex) return 'disabled';
      if (currentStepIndex > stepIndex) return 'done';
      if (currentStepIndex === stepIndex) return 'active';
    }

    return 'disabled';
  };

  return (
    <Modal onClose={handleClose} isOpen={isSwapProgressOpened} isCentered>
      <ModalOverlay />
      <TransactionProgressModalContent>
        {steps?.includes('deposit') && (
          <TransactionStep
            status={getStepStatus('deposit')}
            iconSrc={depositSrc}
            chevron
          >
            Depositing <br /> {fromTokenSymbol}
          </TransactionStep>
        )}
        <TransactionStep
          status={getStepStatus('swap')}
          iconSrc={swapSrc}
          chevron={steps?.includes('withdraw')}
        >
          Swapping <br /> {fromTokenSymbol} to {toTokenSymbol}
        </TransactionStep>
        {steps?.includes('withdraw') && (
          <TransactionStep
            status={getStepStatus('withdraw')}
            iconSrc={withdrawSrc}
          >
            Withdrawing <br /> {toTokenSymbol}
          </TransactionStep>
        )}
      </TransactionProgressModalContent>
    </Modal>
  );
};
