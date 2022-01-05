import { Flex, Modal, ModalOverlay } from '@chakra-ui/react';

import { withdrawSrc } from '@/assets';
import {
  modalsSliceActions,
  UnwrapModalDataStep,
  useAppDispatch,
  useModalsStore,
} from '@/store';

import { useStepStatus } from '.';
import { TransactionProgressModalContent, TransactionStep } from './components';

export const UnwrapProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isUnwrapProgressModalOpened, unwrapModalData } = useModalsStore();
  const { steps, step: activeStep } = unwrapModalData;

  const getStepStatus = useStepStatus<UnwrapModalDataStep>({
    activeStep,
    steps,
  });

  const handleClose = () => {
    dispatch(modalsSliceActions.closeUnwrapProgressModal());
  };

  return (
    <Modal
      onClose={handleClose}
      isOpen={isUnwrapProgressModalOpened}
      isCentered
    >
      <ModalOverlay />

      <TransactionProgressModalContent title="Unwrapping WICP">
        <Flex alignItems="flex-start">
          {steps?.includes(UnwrapModalDataStep.Withdraw) && (
            <TransactionStep
              status={getStepStatus(UnwrapModalDataStep.Withdraw)}
              iconSrc={withdrawSrc}
              chevron
            >
              Withdrawing <br /> WICP
            </TransactionStep>
          )}
          <TransactionStep
            status={getStepStatus(UnwrapModalDataStep.WithdrawWICP)}
            iconSrc={withdrawSrc}
          >
            Unwrapping <br /> WICP
          </TransactionStep>
        </Flex>
      </TransactionProgressModalContent>
    </Modal>
  );
};
