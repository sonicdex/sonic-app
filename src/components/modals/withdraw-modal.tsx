import { useMemo } from 'react';
import { HStack, Modal, ModalOverlay } from '@chakra-ui/react';

import { modalsSliceActions, useAppDispatch, useModalsStore } from '@/store';
import { swapSrc } from '@/assets';

import { TransactionProgressModalContent, TransactionStep } from './components';

export const WithdrawProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isWithdrawProgressOpened, withdrawData } = useModalsStore();
  const { tokenSymbol, step: activeStep } = withdrawData;

  const handleClose = () => {
    dispatch(modalsSliceActions.closeWithdrawProgressModal());
  };

  const stepStatus = useMemo(() => {
    if (activeStep === 'withdraw') {
      return 'active';
    }

    return 'done';
  }, [activeStep]);

  return (
    <Modal onClose={handleClose} isOpen={isWithdrawProgressOpened} isCentered>
      <ModalOverlay />
      <TransactionProgressModalContent title="Withdraw in Progress">
        <HStack>
          <TransactionStep status={stepStatus} iconSrc={swapSrc}>
            Withdrawing <br /> {tokenSymbol}
          </TransactionStep>
        </HStack>
      </TransactionProgressModalContent>
    </Modal>
  );
};
