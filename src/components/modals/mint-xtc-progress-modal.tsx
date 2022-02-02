import { Flex } from '@chakra-ui/react';

import { checkPlainSrc, depositSrc, swapSrc, withdrawSrc } from '@/assets';
import {
  MintXTCModalData,
  MintXTCModalDataStep,
  modalsSliceActions,
  useAppDispatch,
  useModalsStore,
} from '@/store';

import { useStepStatus } from '.';
import { TransactionProgressModal, TransactionStep } from './components';

export const MintXTCProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isMintXTCProgressModalOpened, mintXTCModalData } = useModalsStore();
  const { steps, step: activeStep } = mintXTCModalData;

  const getStepStatus = useStepStatus<MintXTCModalData['step']>({
    activeStep,
    steps,
  });

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
      <Flex alignItems="flex-start">
        <TransactionStep
          status={getStepStatus(MintXTCModalDataStep.LedgerTransfer)}
          iconSrc={withdrawSrc}
          chevron
        >
          Ledger Transfer <br /> ICP
        </TransactionStep>
        <TransactionStep
          status={getStepStatus(MintXTCModalDataStep.MintXTC)}
          iconSrc={swapSrc}
          chevron={
            steps?.includes(MintXTCModalDataStep.Approve) ||
            steps?.includes(MintXTCModalDataStep.Deposit)
          }
        >
          Minting <br /> XTC
        </TransactionStep>
        {steps?.includes(MintXTCModalDataStep.Approve) && (
          <TransactionStep
            status={getStepStatus(MintXTCModalDataStep.Approve)}
            iconSrc={checkPlainSrc}
            chevron
          >
            Approving <br /> XTC
          </TransactionStep>
        )}
        {steps?.includes(MintXTCModalDataStep.Deposit) && (
          <TransactionStep
            status={getStepStatus(MintXTCModalDataStep.Deposit)}
            iconSrc={depositSrc}
          >
            Depositing <br /> XTC
          </TransactionStep>
        )}
      </Flex>
    </TransactionProgressModal>
  );
};
