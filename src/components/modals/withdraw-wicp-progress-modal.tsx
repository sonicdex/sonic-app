import { swapSrc, withdrawSrc } from '@/assets';
import {
  modalsSliceActions,useAppDispatch,useModalsStore, WithdrawWICPModalData, WithdrawWICPModalDataStep,
} from '@/store';

import { useStepStatus } from '.';
import { TransactionProgressModal, TransactionStep } from './components';

export const WithdrawWICPProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isWithdrawWICPProgressModalOpened, withdrawWICPModalData } = useModalsStore();
  const { steps, step: activeStep } = withdrawWICPModalData;

  const getStepStatus = useStepStatus<WithdrawWICPModalData['step']>({activeStep,steps,});

  const handleClose = () => {
    dispatch(modalsSliceActions.closeWithdrawWICPProgressModal());
  };

  return (
    <TransactionProgressModal
      onClose={handleClose}
      isOpen={isWithdrawWICPProgressModalOpened}
      isCentered
      title="WICP unwrapping in progress"
    >
      {steps?.includes(WithdrawWICPModalDataStep.Withdraw) && (
        <TransactionStep
          status={getStepStatus(WithdrawWICPModalDataStep.Withdraw)}
          iconSrc={withdrawSrc}
          chevron
        >
          Withdrawing <br /> WICP
        </TransactionStep>
      )}
      <TransactionStep
        status={getStepStatus(WithdrawWICPModalDataStep.WithdrawWICP)}
        iconSrc={swapSrc}
      >
        Unwrapping <br /> WICP
      </TransactionStep>
    </TransactionProgressModal>
  );
};
