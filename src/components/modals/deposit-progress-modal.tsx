import { checkPlainSrc, depositSrc } from '@/assets';
import {
  DepositModalData,
  DepositModalDataStep,
  modalsSliceActions,
  useAppDispatch,
  useModalsStore,
} from '@/store';

import { useStepStatus } from '.';
import { TransactionProgressModal, TransactionStep } from './components';

export const DepositProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isDepositProgressModalOpened, depositModalData } = useModalsStore();
  const { steps, tokenSymbol, step: activeStep } = depositModalData;

  const getStepStatus = useStepStatus<DepositModalData['step']>({
    activeStep,
    steps,
  });

  const handleClose = () => {
    dispatch(modalsSliceActions.closeDepositProgressModal());
  };

  return (
    <TransactionProgressModal
      onClose={handleClose}
      isOpen={isDepositProgressModalOpened}
      isCentered
      title="Deposit in progress"
    >
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
    </TransactionProgressModal>
  );
};
