import { Flex, Modal, ModalOverlay } from '@chakra-ui/react';

import { checkPlainSrc, depositSrc } from '@/assets';
import {
  DepositModalDataStep,
  modalsSliceActions,
  useAppDispatch,
  useModalsStore,
} from '@/store';

import { useStepStatus } from '.';
import { TransactionProgressModalContent, TransactionStep } from './components';

export const DepositProgressModal = () => {
  const dispatch = useAppDispatch();
  const {
    isDepositProgressModalOpened: isDepositProgressOpened,
    depositModalData: depositData,
  } = useModalsStore();
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
        <Flex alignItems="flex-start">
          {steps?.includes(DepositModalDataStep.Approve) && (
            <TransactionStep
              status={getStepStatus(DepositModalDataStep.Approve)}
              iconSrc={checkPlainSrc}
              chevron
            >
              Approving <br /> {tokenSymbol}
            </TransactionStep>
          )}
          <TransactionStep
            status={getStepStatus(DepositModalDataStep.Deposit)}
            iconSrc={depositSrc}
          >
            Depositing <br /> {tokenSymbol}
          </TransactionStep>
        </Flex>
      </TransactionProgressModalContent>
    </Modal>
  );
};
