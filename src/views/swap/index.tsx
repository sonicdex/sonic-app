import { HomeStep, ReviewStep } from './components/steps';
import { useUserBalances } from '@/hooks/use-user-balances';
import { SwapStep, useSwapViewStore } from '@/store';

export const Swap = () => {
  const { step } = useSwapViewStore();

  const { totalBalances } = useUserBalances();

  const steps = {
    [SwapStep.Home]: <HomeStep balances={totalBalances} />,
    [SwapStep.Review]: <ReviewStep balances={totalBalances} />,
  };

  if (steps.hasOwnProperty(step)) {
    return steps[step];
  }

  return steps[SwapStep.Home];
};
