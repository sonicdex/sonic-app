import { Flex } from '@chakra-ui/react';

import { checkPlainSrc, depositSrc, swapSrc, withdrawSrc } from '@/assets';
import {
  MintWICPModalData,
  MintWICPModalDataStep,
  modalsSliceActions,
  useAppDispatch,
  useModalsStore,
} from '@/store';

import { useStepStatus } from '.';
import { TransactionProgressModal, TransactionStep } from './components';

export const MintWICPProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isMintWICPProgressModalOpened, mintWICPModalData } = useModalsStore();
  const { steps, step: activeStep } = mintWICPModalData;
  const getStepStatus = useStepStatus<MintWICPModalData['step']>({
    activeStep,
    steps,
  });

  const handleClose = () => {
    dispatch(modalsSliceActions.closeMintWICPProgressModal());
  };

  return (
    <TransactionProgressModal
      onClose={handleClose}
      isOpen={isMintWICPProgressModalOpened}
      isCentered
      title="ICP wrapping in progress"
    >
      <Flex alignItems="flex-start">
        {steps?.includes(MintWICPModalDataStep.LedgerTransfer) && (
          <TransactionStep
            status={getStepStatus(MintWICPModalDataStep.LedgerTransfer)}
            iconSrc={withdrawSrc}
            chevron
          >
            Ledger Transfer <br />
            ICP
          </TransactionStep>
        )}
        <TransactionStep
          status={getStepStatus(MintWICPModalDataStep.MintWIPC)}
          iconSrc={swapSrc}
          chevron={
            steps?.includes(MintWICPModalDataStep.Approve) ||
            steps?.includes(MintWICPModalDataStep.Deposit)
          }
        >
          Minting <br /> WICP
        </TransactionStep>
        {steps?.includes(MintWICPModalDataStep.Approve) && (
          <TransactionStep
            status={getStepStatus(MintWICPModalDataStep.Approve)}
            iconSrc={checkPlainSrc}
            chevron
          >
            Approving <br /> WICP
          </TransactionStep>
        )}
        {steps?.includes(MintWICPModalDataStep.Deposit) && (
          <TransactionStep
            status={getStepStatus(MintWICPModalDataStep.Deposit)}
            iconSrc={depositSrc}
          >
            Depositing <br /> WICP
          </TransactionStep>
        )}
      </Flex>
    </TransactionProgressModal>
  );
};
