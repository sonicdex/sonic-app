import { HomeStep, ReviewStep } from './components/steps';

import { SwapStep, useSwapViewStore } from '@/store';
import { useSwapInit } from '@/integrations/swap';

export const Swap = () => {
  useSwapInit();
  const { step } = useSwapViewStore();

  const steps = {
    [SwapStep.Home]: <HomeStep />,
    [SwapStep.Review]: <ReviewStep />,
  };

  if (steps.hasOwnProperty(step)) {
    return steps[step];
  }

  return steps[SwapStep.Home];
};
