import { Flex, Modal, ModalOverlay } from '@chakra-ui/react';

import { depositSrc, swapSrc, withdrawSrc } from '@/assets';
import {
  MintXTCModalDataStep,
  modalsSliceActions,
  useAppDispatch,
  useModalsStore,
} from '@/store';

import { useStepStatus } from '.';
import { TransactionProgressModalContent, TransactionStep } from './components';

export const MintXTCProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isMintXTCProgressModalOpened, mintXTCModalData } = useModalsStore();
  const { steps, step: activeStep } = mintXTCModalData;
  const getStepStatus = useStepStatus<MintXTCModalDataStep>({
    activeStep,
    steps,
  });

  const handleClose = () => {
    dispatch(modalsSliceActions.closeMintXTCProgressModal());
  };

  return (
    <Modal
      onClose={handleClose}
      isOpen={isMintXTCProgressModalOpened}
      isCentered
    >
      <ModalOverlay />
      <TransactionProgressModalContent title="Mint XTC in progress">
        <Flex alignItems="flex-start">
          <TransactionStep
            status={getStepStatus(MintXTCModalDataStep.LedgerTransfer)}
            iconSrc={depositSrc}
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
              iconSrc={withdrawSrc}
              chevron
            >
              Approving <br /> XTC
            </TransactionStep>
          )}
          {steps?.includes(MintXTCModalDataStep.Deposit) && (
            <TransactionStep
              status={getStepStatus(MintXTCModalDataStep.Deposit)}
              iconSrc={withdrawSrc}
            >
              Depositing <br /> XTC
            </TransactionStep>
          )}
        </Flex>
      </TransactionProgressModalContent>
    </Modal>
  );
};
