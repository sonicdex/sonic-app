import { checkPlainSrc, depositSrc, swapSrc, withdrawSrc } from '@/assets';
import {
  MintModalData,MintModalDataStep,modalsSliceActions,useAppDispatch,useModalsStore,
} from '@/store';

import { useStepStatus } from '.';
import { TransactionProgressModal, TransactionStep } from './components';

export const MintXTCProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isMintXTCProgressModalOpened, mintXTCModalData } = useModalsStore();
  const { steps, step: activeStep } = mintXTCModalData;

  const getStepStatus = useStepStatus<MintModalData['step']>({activeStep,steps,});
  const handleClose = () => {
    dispatch(modalsSliceActions.closeMintXTCProgressModal());
  };

  return (
    <TransactionProgressModal
      onClose={handleClose}
      isOpen={isMintXTCProgressModalOpened}
      isCentered
      title="Mint XTC in progress"
    >
      <TransactionStep status={getStepStatus(MintModalDataStep.LedgerTransfer)} iconSrc={withdrawSrc} chevron>
        Ledger Transfer <br /> ICP
      </TransactionStep>
      <TransactionStep
        status={getStepStatus(MintModalDataStep.Mint)}
        iconSrc={swapSrc}
        chevron={
          steps?.includes(MintModalDataStep.Approve) ||
          steps?.includes(MintModalDataStep.Deposit)
        }
      >
        Minting <br /> XTC
      </TransactionStep>
      {steps?.includes(MintModalDataStep.Approve) && (
        <TransactionStep
          status={getStepStatus(MintModalDataStep.Approve)}
          iconSrc={checkPlainSrc}
          chevron
        >
          Approving <br /> XTC
        </TransactionStep>
      )}
      {steps?.includes(MintModalDataStep.Deposit) && (
        <TransactionStep
          status={getStepStatus(MintModalDataStep.Deposit)}
          iconSrc={depositSrc}
        >
          Depositing <br /> XTC
        </TransactionStep>
      )}
    </TransactionProgressModal>
  );
};
