import { HStack, Modal, ModalOverlay } from '@chakra-ui/react';

import { TransactionProgressModalContent, TransactionStep } from './components';
import {
  DepositModalDataStep,
  modalsSliceActions,
  useAppDispatch,
  useModalsStore,
} from '@/store';
import { checkPlainSrc, depositSrc } from '@/assets';
import { useStepStatus } from '.';

export const DepositProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isDepositProgressOpened, depositData } = useModalsStore();
  const { steps, tokenSymbol, step: activeStep } = depositData;

  const getStepStatus = useStepStatus<DepositModalDataStep>({
    activeStep,
    steps,
  });

  const handleClose = () => {
    dispatch(modalsSliceActions.closeDepositProgressModal());
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
