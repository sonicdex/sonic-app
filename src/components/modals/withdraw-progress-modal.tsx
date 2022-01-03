import { HStack, Modal, ModalOverlay } from '@chakra-ui/react';

import { swapSrc } from '@/assets';
import {
  modalsSliceActions,
  useAppDispatch,
  useModalsStore,
  WithdrawModalDataStep,
} from '@/store';

import { useStepStatus } from '.';
import { TransactionProgressModalContent, TransactionStep } from './components';

export const WithdrawProgressModal = () => {
  const dispatch = useAppDispatch();
  const {
    isWithdrawProgressModalOpened: isWithdrawProgressOpened,
    withdrawModalData: withdrawData,
  } = useModalsStore();
  const { tokenSymbol, steps, step: activeStep } = withdrawData;

  const getStepStatus = useStepStatus<WithdrawModalDataStep>({
    activeStep,
    steps,
  });

  const handleClose = () => {
    dispatch(modalsSliceActions.closeWithdrawProgressModal());
  };

  return (
    <Modal onClose={handleClose} isOpen={isWithdrawProgressOpened} isCentered>
      <ModalOverlay />
      <TransactionProgressModalContent title="Withdraw in Progress">
        <HStack>
          <TransactionStep
            status={getStepStatus(WithdrawModalDataStep.Withdraw)}
            iconSrc={swapSrc}
          >
            Withdrawing <br /> {tokenSymbol}
          </TransactionStep>
        </HStack>
      </TransactionProgressModalContent>
    </Modal>
  );
};
