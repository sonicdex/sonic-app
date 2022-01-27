import { Flex } from '@chakra-ui/react';

import { withdrawSrc } from '@/assets';
import {
  modalsSliceActions,
  useAppDispatch,
  useModalsStore,
  WithdrawModalData,
  WithdrawModalDataStep,
} from '@/store';

import { useStepStatus } from '.';
import { TransactionProgressModal, TransactionStep } from './components';

export const WithdrawProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isWithdrawProgressModalOpened, withdrawModalData } = useModalsStore();
  const { tokenSymbol, steps, step: activeStep } = withdrawModalData;

  const getStepStatus = useStepStatus<WithdrawModalData['step']>({
    activeStep,
    steps,
  });

  const handleClose = () => {
    dispatch(modalsSliceActions.closeWithdrawProgressModal());
  };

  return (
    <TransactionProgressModal
      title="Withdraw in progress"
      onClose={handleClose}
      isOpen={isWithdrawProgressModalOpened}
      isCentered
    >
      <Flex alignItems="flex-start">
        <TransactionStep
          status={getStepStatus(WithdrawModalDataStep.Withdraw)}
          iconSrc={withdrawSrc}
        >
          Withdrawing <br /> {tokenSymbol}
        </TransactionStep>
      </Flex>
    </TransactionProgressModal>
  );
};
