import { HStack, Modal, ModalOverlay } from '@chakra-ui/react';

import { TransactionProgressModalContent, TransactionStep } from './components';
import {
  modalsSliceActions,
  useAppDispatch,
  useModalsStore,
  WrapModalDataStep,
} from '@/store';
import { swapSrc, withdrawSrc } from '@/assets';
import { useStepStatus } from '.';

export const WrapProgressModal = () => {
  const dispatch = useAppDispatch();
  const {
    isWrapProgressModalOpened: isWrapProgressOpened,
    wrapModalData: wrapData,
  } = useModalsStore();
  const { steps, step: activeStep } = wrapData;
  const getStepStatus = useStepStatus<WrapModalDataStep>({ activeStep, steps });

  const handleClose = () => {
    dispatch(modalsSliceActions.closeWrapProgressModal());
  };

  return (
    <Modal onClose={handleClose} isOpen={isWrapProgressOpened} isCentered>
      <ModalOverlay />
      <TransactionProgressModalContent title="Wrapping ICP in Progress">
        <HStack>
          <TransactionStep
            status={getStepStatus(WrapModalDataStep.LedgerTransfer)}
            iconSrc={withdrawSrc}
            chevron
          >
            Ledger ICP Transfer
          </TransactionStep>
          <TransactionStep
            status={getStepStatus(WrapModalDataStep.MintWIPC)}
            iconSrc={swapSrc}
            chevron={
              steps?.includes(WrapModalDataStep.Approve) ||
              steps?.includes(WrapModalDataStep.Deposit)
            }
          >
            Minting WICP
          </TransactionStep>
          {steps?.includes(WrapModalDataStep.Approve) && (
            <TransactionStep
              status={getStepStatus(WrapModalDataStep.Approve)}
              iconSrc={withdrawSrc}
              chevron
            >
              Approving <br /> WICP
            </TransactionStep>
          )}
          {steps?.includes(WrapModalDataStep.Deposit) && (
            <TransactionStep
              status={getStepStatus(WrapModalDataStep.Deposit)}
              iconSrc={withdrawSrc}
            >
              Depositing <br /> WICP
            </TransactionStep>
          )}
        </HStack>
      </TransactionProgressModalContent>
    </Modal>
  );
};
