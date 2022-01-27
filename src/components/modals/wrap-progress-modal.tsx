import { Flex } from '@chakra-ui/react';

import { checkPlainSrc, depositSrc, swapSrc, withdrawSrc } from '@/assets';
import {
  modalsSliceActions,
  useAppDispatch,
  useModalsStore,
  WrapModalData,
  WrapModalDataStep,
} from '@/store';

import { useStepStatus } from '.';
import { TransactionProgressModal, TransactionStep } from './components';

export const WrapProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isWrapProgressModalOpened, wrapModalData } = useModalsStore();
  const { steps, step: activeStep } = wrapModalData;
  const getStepStatus = useStepStatus<WrapModalData['step']>({
    activeStep,
    steps,
  });

  const handleClose = () => {
    dispatch(modalsSliceActions.closeWrapProgressModal());
  };

  return (
    <TransactionProgressModal
      onClose={handleClose}
      isOpen={isWrapProgressModalOpened}
      isCentered
      title="ICP wrapping in progress"
    >
      <Flex alignItems="flex-start">
        <TransactionStep
          status={getStepStatus(WrapModalDataStep.LedgerTransfer)}
          iconSrc={withdrawSrc}
          chevron
        >
          Ledger Transfer <br />
          ICP
        </TransactionStep>
        <TransactionStep
          status={getStepStatus(WrapModalDataStep.MintWIPC)}
          iconSrc={swapSrc}
          chevron={
            steps?.includes(WrapModalDataStep.Approve) ||
            steps?.includes(WrapModalDataStep.Deposit)
          }
        >
          Minting <br /> WICP
        </TransactionStep>
        {steps?.includes(WrapModalDataStep.Approve) && (
          <TransactionStep
            status={getStepStatus(WrapModalDataStep.Approve)}
            iconSrc={checkPlainSrc}
            chevron
          >
            Approving <br /> WICP
          </TransactionStep>
        )}
        {steps?.includes(WrapModalDataStep.Deposit) && (
          <TransactionStep
            status={getStepStatus(WrapModalDataStep.Deposit)}
            iconSrc={depositSrc}
          >
            Depositing <br /> WICP
          </TransactionStep>
        )}
      </Flex>
    </TransactionProgressModal>
  );
};
