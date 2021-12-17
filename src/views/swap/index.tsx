import { SwapHomeStep, SwapReviewStep } from './components';

import { SwapStep, useSwapView, useSwapViewStore } from '@/store';

export const Swap = () => {
  useSwapView();
  const { step } = useSwapViewStore();

  const steps = {
    [SwapStep.Home]: <SwapHomeStep />,
    [SwapStep.Review]: <SwapReviewStep />,
  };

  if (steps.hasOwnProperty(step)) {
    return steps[step];
  }

  return steps[SwapStep.Home];
};
