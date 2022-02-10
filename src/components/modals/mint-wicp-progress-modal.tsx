import { Flex } from '@chakra-ui/react';

import { checkPlainSrc, depositSrc, swapSrc, withdrawSrc } from '@/assets';
import {
  MintModalData,
  MintModalDataStep,
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
  const getStepStatus = useStepStatus<MintModalData['step']>({
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
        {steps?.includes(MintModalDataStep.LedgerTransfer) && (
          <TransactionStep
            status={getStepStatus(MintModalDataStep.LedgerTransfer)}
            iconSrc={withdrawSrc}
            chevron
          >
            Ledger Transfer <br />
            ICP
          </TransactionStep>
        )}
        <TransactionStep
          status={getStepStatus(MintModalDataStep.Mint)}
          iconSrc={swapSrc}
          chevron={
            steps?.includes(MintModalDataStep.Approve) ||
            steps?.includes(MintModalDataStep.Deposit)
          }
        >
          Minting <br /> WICP
        </TransactionStep>
        {steps?.includes(MintModalDataStep.Approve) && (
          <TransactionStep
            status={getStepStatus(MintModalDataStep.Approve)}
            iconSrc={checkPlainSrc}
            chevron
          >
            Approving <br /> WICP
          </TransactionStep>
        )}
        {steps?.includes(MintModalDataStep.Deposit) && (
          <TransactionStep
            status={getStepStatus(MintModalDataStep.Deposit)}
            iconSrc={depositSrc}
          >
            Depositing <br /> WICP
          </TransactionStep>
        )}
      </Flex>
    </TransactionProgressModal>
  );
};
