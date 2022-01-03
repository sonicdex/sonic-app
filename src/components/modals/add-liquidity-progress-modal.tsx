import { HStack, Modal, ModalOverlay } from '@chakra-ui/react';

import { depositSrc, plusSrc, swapSrc } from '@/assets';
import {
  AddLiquidityModalDataStep,
  modalsSliceActions,
  useAppDispatch,
  useModalsStore,
} from '@/store';

import { useStepStatus } from '.';
import { TransactionProgressModalContent, TransactionStep } from './components';

export const AddLiquidityProgressModal = () => {
  const dispatch = useAppDispatch();
  const {
    isAddLiquidityProgressModalOpened: isAddLiquidityProgressOpened,
    addLiquidityModalData: addLiquidityData,
  } = useModalsStore();
  const {
    steps,
    token1Symbol,
    token0Symbol,
    step: activeStep,
  } = addLiquidityData;

  const getStepStatus = useStepStatus<AddLiquidityModalDataStep>({
    activeStep,
    steps,
  });

  const handleClose = () => {
    dispatch(modalsSliceActions.closeAddLiquidityProgressModal());
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
          {steps?.includes(AddLiquidityModalDataStep.CreatePair) && (
            <TransactionStep
              status={getStepStatus(AddLiquidityModalDataStep.CreatePair)}
              iconSrc={plusSrc}
              chevron
            >
              Creating pair <br /> {token0Symbol} - {token1Symbol}
            </TransactionStep>
          )}
          {steps?.includes(AddLiquidityModalDataStep.Approve0) && (
            <TransactionStep
              status={getStepStatus(AddLiquidityModalDataStep.Approve0)}
              iconSrc={depositSrc}
              chevron
            >
              Approving usage <br /> {token0Symbol}
            </TransactionStep>
          )}
          {steps?.includes(AddLiquidityModalDataStep.Deposit0) && (
            <TransactionStep
              status={getStepStatus(AddLiquidityModalDataStep.Deposit0)}
              iconSrc={depositSrc}
              chevron
            >
              Depositing <br /> {token0Symbol}
            </TransactionStep>
          )}
          {steps?.includes(AddLiquidityModalDataStep.Approve1) && (
            <TransactionStep
              status={getStepStatus(AddLiquidityModalDataStep.Approve1)}
              iconSrc={depositSrc}
              chevron
            >
              Approving usage <br /> {token1Symbol}
            </TransactionStep>
          )}
          {steps?.includes(AddLiquidityModalDataStep.Deposit1) && (
            <TransactionStep
              status={getStepStatus(AddLiquidityModalDataStep.Deposit1)}
              iconSrc={depositSrc}
              chevron
            >
              Depositing <br /> {token1Symbol}
            </TransactionStep>
          )}
          <TransactionStep
            status={getStepStatus(AddLiquidityModalDataStep.AddLiquidity)}
            iconSrc={swapSrc}
          >
            Adding Liquidity <br /> {token0Symbol} + {token1Symbol}
          </TransactionStep>
        </HStack>
      </TransactionProgressModalContent>
    </Modal>
  );
};
