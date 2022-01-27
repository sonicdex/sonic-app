import { Flex } from '@chakra-ui/react';

import { checkPlainSrc, depositSrc, swapSrc, withdrawSrc } from '@/assets';
import {
  modalsSliceActions,
  SwapModalData,
  SwapModalDataStep,
  useAppDispatch,
  useModalsStore,
} from '@/store';

import { useStepStatus } from '.';
import { TransactionProgressModal, TransactionStep } from './components';

export const SwapProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isSwapProgressModalOpened, swapModalData } = useModalsStore();
  const {
    steps,
    fromTokenSymbol,
    toTokenSymbol,
    step: activeStep,
  } = swapModalData;
  const getStepStatus = useStepStatus<SwapModalData['step']>({
    activeStep,
    steps,
  });

  const handleClose = () => {
    dispatch(modalsSliceActions.closeSwapProgressModal());
  };

  return (
    <TransactionProgressModal
      onClose={handleClose}
      isOpen={isSwapProgressModalOpened}
      isCentered
      title="Swap in progress"
    >
      <Flex alignItems="flex-start">
        {steps?.includes(SwapModalDataStep.Approve) && (
          <TransactionStep
            status={getStepStatus(SwapModalDataStep.Approve)}
            iconSrc={checkPlainSrc}
            chevron
          >
            Approving <br /> {fromTokenSymbol}
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
      </Flex>
    </TransactionProgressModal>
  );
};
