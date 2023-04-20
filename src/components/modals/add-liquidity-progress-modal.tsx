import { checkPlainSrc, depositSrc, dropSrc, plusSrc } from '@/assets';
import {
  AddLiquidityModalData,
  AddLiquidityModalDataStep,
  modalsSliceActions,
  useAppDispatch,
  useModalsStore,
} from '@/store';

import { useStepStatus } from '.';
import { TransactionProgressModal, TransactionStep } from './components';

export const AddLiquidityProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isAddLiquidityProgressModalOpened, addLiquidityModalData } =
    useModalsStore();
  const {
    steps,
    token1Symbol,
    token0Symbol,
    step: activeStep,
  } = addLiquidityModalData;

  const getStepStatus = useStepStatus<AddLiquidityModalData['step']>({
    activeStep,
    steps,
  });

  const handleClose = () => {
    dispatch(modalsSliceActions.closeAddLiquidityProgressModal());
  };

  return (
    <TransactionProgressModal
      onClose={handleClose}
      isOpen={isAddLiquidityProgressModalOpened}
      isCentered
      title="Add LP in progress"
    >
      {steps?.includes(AddLiquidityModalDataStep.Approve0) && (
        <TransactionStep
          status={getStepStatus(AddLiquidityModalDataStep.Approve0)}
          iconSrc={checkPlainSrc}
          chevron
        >
          Approving <br /> {token0Symbol}
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
          iconSrc={checkPlainSrc}
          chevron
        >
          Approving <br /> {token1Symbol}
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
      {steps?.includes(AddLiquidityModalDataStep.CreatePair) && (
        <TransactionStep
          status={getStepStatus(AddLiquidityModalDataStep.CreatePair)}
          iconSrc={plusSrc}
          chevron
        >
          Creating pair <br /> {token0Symbol} - {token1Symbol}
        </TransactionStep>
      )}
      <TransactionStep
        status={getStepStatus(AddLiquidityModalDataStep.AddLiquidity)}
        iconSrc={dropSrc}
      >
        Adding LP of <br /> {token0Symbol} + {token1Symbol}
      </TransactionStep>
    </TransactionProgressModal>
  );
};
