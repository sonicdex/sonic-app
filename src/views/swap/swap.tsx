import { SwapStep, useSwapView, useSwapViewStore } from '@/store';

import { SwapHomeStep, SwapReviewStep } from './components';

export const SwapView = () => {
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
