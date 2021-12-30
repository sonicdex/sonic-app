import { HStack, Modal, ModalOverlay } from '@chakra-ui/react';

import { TransactionProgressModalContent, TransactionStep } from './components';
import {
  modalsSliceActions,
  SwapModalDataStep,
  useAppDispatch,
  useModalsStore,
} from '@/store';
import { checkPlainSrc, depositSrc, swapSrc, withdrawSrc } from '@/assets';
import { useStepStatus } from '.';

export const SwapProgressModal = () => {
  const dispatch = useAppDispatch();
  const {
    isSwapProgressModalOpened: isSwapProgressOpened,
    swapModalData: swapData,
  } = useModalsStore();
  const { steps, fromTokenSymbol, toTokenSymbol, step: activeStep } = swapData;
  const getStepStatus = useStepStatus<SwapModalDataStep>({ activeStep, steps });

  const handleClose = () => {
    dispatch(modalsSliceActions.closeSwapProgressModal());
  };

  return (
    <Modal onClose={handleClose} isOpen={isSwapProgressOpened} isCentered>
      <ModalOverlay />
      <TransactionProgressModalContent title="Swap in Progress">
        <HStack>
          {steps?.includes(SwapModalDataStep.Approve) && (
            <TransactionStep
              status={getStepStatus(SwapModalDataStep.Approve)}
              iconSrc={checkPlainSrc}
              chevron
            >
              Approving usage <br /> {fromTokenSymbol}
            </TransactionStep>
          )}
          {steps?.includes(SwapModalDataStep.Deposit) && (
            <TransactionStep
              status={getStepStatus(SwapModalDataStep.Deposit)}
              iconSrc={depositSrc}
              chevron
            >
              Depositing <br /> {fromTokenSymbol}
            </TransactionStep>
          )}
          <TransactionStep
            status={getStepStatus(SwapModalDataStep.Swap)}
            iconSrc={swapSrc}
            chevron={steps?.includes(SwapModalDataStep.Withdraw)}
          >
            Swapping <br /> {fromTokenSymbol} to {toTokenSymbol}
          </TransactionStep>
          {steps?.includes(SwapModalDataStep.Withdraw) && (
            <TransactionStep
              status={getStepStatus(SwapModalDataStep.Withdraw)}
              iconSrc={withdrawSrc}
            >
              Withdrawing <br /> {toTokenSymbol}
            </TransactionStep>
          )}
        </HStack>
      </TransactionProgressModalContent>
    </Modal>
  );
};
