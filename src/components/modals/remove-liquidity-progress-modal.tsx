import { Flex, Modal, ModalOverlay } from '@chakra-ui/react';

import { depositSrc, swapSrc } from '@/assets';
import {
  modalsSliceActions,
  RemoveLiquidityModalDataStep,
  useAppDispatch,
  useModalsStore,
} from '@/store';

import { useStepStatus } from '.';
import { TransactionProgressModalContent, TransactionStep } from './components';

export const RemoveLiquidityProgressModal = () => {
  const dispatch = useAppDispatch();
  const {
    isRemoveLiquidityProgressModalOpened: isRemoveLiquidityProgressOpened,
    removeLiquidityModalData: removeLiquidityData,
  } = useModalsStore();
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
        <Flex alignItems="flex-start">
          <TransactionStep
            status={getStepStatus(RemoveLiquidityModalDataStep.RemoveLiquidity)}
            iconSrc={swapSrc}
            chevron={
              steps?.includes(RemoveLiquidityModalDataStep.Withdraw0) ||
              steps?.includes(RemoveLiquidityModalDataStep.Withdraw1)
            }
          >
            Removing Liquidity <br /> {token0Symbol} + {token1Symbol}
          </TransactionStep>

          {steps?.includes(RemoveLiquidityModalDataStep.Withdraw0) && (
            <TransactionStep
              status={getStepStatus(RemoveLiquidityModalDataStep.Withdraw0)}
              iconSrc={depositSrc}
              chevron={steps?.includes(RemoveLiquidityModalDataStep.Withdraw1)}
            >
              Withdrawing <br /> {token0Symbol}
            </TransactionStep>
          )}
          {steps?.includes(RemoveLiquidityModalDataStep.Withdraw1) && (
            <TransactionStep
              status={getStepStatus(RemoveLiquidityModalDataStep.Withdraw1)}
              iconSrc={depositSrc}
            >
              Withdrawing <br /> {token1Symbol}
            </TransactionStep>
          )}
        </Flex>
      </TransactionProgressModalContent>
    </Modal>
  );
};
