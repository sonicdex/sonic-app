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
  const { isWrapProgressOpened, wrapData } = useModalsStore();
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
            status={getStepStatus('ledgerTransfer')}
            iconSrc={withdrawSrc}
            chevron
          >
            Transferring ICP to ledger
          </TransactionStep>
          <TransactionStep
            status={getStepStatus('mintWICP')}
            iconSrc={swapSrc}
            chevron={steps?.includes('withdraw')}
          >
            Minting WICP
          </TransactionStep>
          {steps?.includes('withdraw') && (
            <TransactionStep
              status={getStepStatus('withdraw')}
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
