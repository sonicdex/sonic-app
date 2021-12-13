import { HomeStep, ReviewStep } from './components/steps';

import { SwapStep, useSwapViewStore } from '@/store';

export const Swap = () => {
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
