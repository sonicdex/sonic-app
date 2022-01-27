import { Flex } from '@chakra-ui/react';

import { swapSrc, withdrawSrc } from '@/assets';
import {
  modalsSliceActions,
  UnwrapModalData,
  UnwrapModalDataStep,
  useAppDispatch,
  useModalsStore,
} from '@/store';

import { useStepStatus } from '.';
import { TransactionProgressModal, TransactionStep } from './components';

export const UnwrapProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isUnwrapProgressModalOpened, unwrapModalData } = useModalsStore();
  const { steps, step: activeStep } = unwrapModalData;

  const getStepStatus = useStepStatus<UnwrapModalData['step']>({
    activeStep,
    steps,
  });

  const handleClose = () => {
    dispatch(modalsSliceActions.closeUnwrapProgressModal());
  };

  return (
    <TransactionProgressModal
      onClose={handleClose}
      isOpen={isUnwrapProgressModalOpened}
      isCentered
      title="WICP unwrapping in progress"
    >
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
          iconSrc={swapSrc}
        >
          Unwrapping <br /> WICP
        </TransactionStep>
      </Flex>
    </TransactionProgressModal>
  );
};
