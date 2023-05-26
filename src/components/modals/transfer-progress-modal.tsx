import {depositSrc } from '@/assets';
import {
  TransferModalData, TransferModalDataStep, modalsSliceActions,
  useAppDispatch, useModalsStore
} from '@/store';

import { useStepStatus } from '.';
import { TransactionProgressModal, TransactionStep } from './components';

export const TransferProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isTransferProgressModalOpened, transferModalData } = useModalsStore();
  const { steps, tokenSymbol, step: activeStep } = transferModalData;

  const getStepStatus = useStepStatus<TransferModalData['step']>({ activeStep, steps });

  const handleClose = () => {
    dispatch(modalsSliceActions.closeTransferProgressModal());
  };

  return (
    <TransactionProgressModal onClose={handleClose}
      isOpen={isTransferProgressModalOpened} isCentered title="Transfer in progress">
      {steps?.includes(TransferModalDataStep.Transfer) && (
        <TransactionStep status={getStepStatus(TransferModalDataStep.Transfer)}
          iconSrc={depositSrc}>
          Transferring {tokenSymbol}
        </TransactionStep>
      )}
    </TransactionProgressModal>
  );
};
