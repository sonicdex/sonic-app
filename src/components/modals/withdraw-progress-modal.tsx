import { useMemo } from 'react';
import { HStack, Modal, ModalOverlay } from '@chakra-ui/react';

import {
  modalsSliceActions,
  useAppDispatch,
  useModalsStore,
  WithdrawModalDataStep,
} from '@/store';
import { swapSrc } from '@/assets';

import { TransactionProgressModalContent, TransactionStep } from './components';
import { useStepStatus } from '.';

export const WithdrawProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isWithdrawProgressOpened, withdrawData } = useModalsStore();
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
          <TransactionStep status={getStepStatus('withdraw')} iconSrc={swapSrc}>
            Withdrawing <br /> {tokenSymbol}
          </TransactionStep>
        </HStack>
      </TransactionProgressModalContent>
    </Modal>
  );
};
