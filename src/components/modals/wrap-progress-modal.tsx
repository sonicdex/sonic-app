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
            Transferring ICP to ledger
          </TransactionStep>
          <TransactionStep
            status={getStepStatus(WrapModalDataStep.MintWIPC)}
            iconSrc={swapSrc}
            chevron={steps?.includes(WrapModalDataStep.Withdraw)}
          >
            Minting WICP
          </TransactionStep>
          {steps?.includes(WrapModalDataStep.Withdraw) && (
            <TransactionStep
              status={getStepStatus(WrapModalDataStep.Withdraw)}
              iconSrc={withdrawSrc}
            >
              Withdrawing <br /> WICP
            </TransactionStep>
          )}
        </HStack>
      </TransactionProgressModalContent>
    </Modal>
  );
};
