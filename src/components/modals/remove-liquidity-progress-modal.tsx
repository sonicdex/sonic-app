import { dropSrc, withdrawSrc } from '@/assets';
import {
  modalsSliceActions,
  RemoveLiquidityModalData,
  RemoveLiquidityModalDataStep,
  useAppDispatch,
  useModalsStore,
} from '@/store';

import { useStepStatus } from '.';
import { TransactionProgressModal, TransactionStep } from './components';

export const RemoveLiquidityProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isRemoveLiquidityProgressModalOpened, removeLiquidityModalData } =
    useModalsStore();
  const {
    steps,
    token1Symbol,
    token0Symbol,
    step: activeStep,
  } = removeLiquidityModalData;
  const getStepStatus = useStepStatus<RemoveLiquidityModalData['step']>({
    activeStep,
    steps,
  });

  const handleClose = () => {
    dispatch(modalsSliceActions.closeRemoveLiquidityProgressModal());
  };

  return (
    <TransactionProgressModal
      onClose={handleClose}
      isOpen={isRemoveLiquidityProgressModalOpened}
      isCentered
      title="Removing LP in progress"
    >
      <TransactionStep
        status={getStepStatus(RemoveLiquidityModalDataStep.RemoveLiquidity)}
        iconSrc={dropSrc}
        chevron={
          steps?.includes(RemoveLiquidityModalDataStep.Withdraw0) ||
          steps?.includes(RemoveLiquidityModalDataStep.Withdraw1)
        }
      >
        Removing Liquidity Position of <br /> {token0Symbol} + {token1Symbol}
      </TransactionStep>

      {steps?.includes(RemoveLiquidityModalDataStep.Withdraw0) && (
        <TransactionStep
          status={getStepStatus(RemoveLiquidityModalDataStep.Withdraw0)}
          iconSrc={withdrawSrc}
          chevron={steps?.includes(RemoveLiquidityModalDataStep.Withdraw1)}
        >
          Withdrawing <br /> {token0Symbol}
        </TransactionStep>
      )}
      {steps?.includes(RemoveLiquidityModalDataStep.Withdraw1) && (
        <TransactionStep
          status={getStepStatus(RemoveLiquidityModalDataStep.Withdraw1)}
          iconSrc={withdrawSrc}
        >
          Withdrawing <br /> {token1Symbol}
        </TransactionStep>
      )}
    </TransactionProgressModal>
  );
};
