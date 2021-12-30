import { HStack, Modal, ModalOverlay } from '@chakra-ui/react';

import { TransactionProgressModalContent, TransactionStep } from './components';
import {
  modalsSliceActions,
  RemoveLiquidityModalDataStep,
  useAppDispatch,
  useModalsStore,
} from '@/store';
import { depositSrc, swapSrc } from '@/assets';
import { useStepStatus } from '.';

export const RemoveLiquidityProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isRemoveLiquidityProgressOpened, removeLiquidityData } =
    useModalsStore();
  const {
    steps,
    token1Symbol,
    token0Symbol,
    step: activeStep,
  } = removeLiquidityData;
  const getStepStatus = useStepStatus<RemoveLiquidityModalDataStep>({
    activeStep,
    steps,
  });

  const handleClose = () => {
    dispatch(modalsSliceActions.closeRemoveLiquidityProgressModal());
  };

  return (
    <Modal
      onClose={handleClose}
      isOpen={isRemoveLiquidityProgressOpened}
      isCentered
    >
      <ModalOverlay />
      <TransactionProgressModalContent title="Removing Liquidity">
        <HStack>
          <TransactionStep
            status={getStepStatus('removeLiquidity')}
            iconSrc={swapSrc}
            chevron={
              steps?.includes('withdraw0') || steps?.includes('withdraw1')
            }
          >
            Removing Liquidity <br /> {token0Symbol} + {token1Symbol}
          </TransactionStep>

          {steps?.includes('withdraw0') && (
            <TransactionStep
              status={getStepStatus('withdraw0')}
              iconSrc={depositSrc}
              chevron={steps?.includes('withdraw1')}
            >
              Withdrawing <br /> {token0Symbol}
            </TransactionStep>
          )}
          {steps?.includes('withdraw1') && (
            <TransactionStep
              status={getStepStatus('withdraw1')}
              iconSrc={depositSrc}
            >
              Withdrawing <br /> {token1Symbol}
            </TransactionStep>
          )}
        </HStack>
      </TransactionProgressModalContent>
    </Modal>
  );
};
