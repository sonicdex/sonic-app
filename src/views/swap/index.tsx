import { HomeStep, ReviewStep } from './components/steps';

import { SwapStep, useSwapView, useSwapViewStore } from '@/store';

export const Swap = () => {
  useSwapView();
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
