import { HStack, Modal, ModalOverlay } from '@chakra-ui/react';

import { TransactionProgressModalContent, TransactionStep } from './components';
import {
  AddLiquidityModalDataStep,
  modalsSliceActions,
  useAppDispatch,
  useModalsStore,
} from '@/store';
import { depositSrc, plusSrc, swapSrc } from '@/assets';

export const AddLiquidityProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isAddLiquidityProgressOpened, addLiquidityData } = useModalsStore();
  const {
    steps,
    token1Symbol,
    token0Symbol,
    step: activeStep,
  } = addLiquidityData;

  const handleClose = () => {
    dispatch(modalsSliceActions.closeAddLiquidityProgressModal());
  };

  const getStepStatus = (step: AddLiquidityModalDataStep) => {
    if (activeStep) {
      const currentStepIndex = steps?.indexOf(activeStep);
      const stepIndex = steps?.indexOf(step);

      if (currentStepIndex! > stepIndex!) return 'done';
      if (currentStepIndex === stepIndex) return 'active';
    }

    return 'disabled';
  };

  return (
    <Modal
      onClose={handleClose}
      isOpen={isAddLiquidityProgressOpened}
      isCentered
    >
      <ModalOverlay />
      <TransactionProgressModalContent title="Adding Liquidity">
        <HStack>
          {steps?.includes('createPair') && (
            <TransactionStep
              status={getStepStatus('createPair')}
              iconSrc={plusSrc}
              chevron
            >
              Creating pair <br /> {token0Symbol} - {token1Symbol}
            </TransactionStep>
          )}
          {steps?.includes('deposit0') && (
            <TransactionStep
              status={getStepStatus('deposit0')}
              iconSrc={depositSrc}
              chevron
            >
              Depositing <br /> {token0Symbol}
            </TransactionStep>
          )}
          {steps?.includes('deposit1') && (
            <TransactionStep
              status={getStepStatus('deposit1')}
              iconSrc={depositSrc}
              chevron
            >
              Depositing <br /> {token1Symbol}
            </TransactionStep>
          )}
          <TransactionStep
            status={getStepStatus('addLiquidity')}
            iconSrc={swapSrc}
          >
            Adding Liquidity <br /> {token0Symbol} + {token1Symbol}
          </TransactionStep>
        </HStack>
      </TransactionProgressModalContent>
    </Modal>
  );
};
