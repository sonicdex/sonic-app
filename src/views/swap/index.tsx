import { useEffect } from 'react';

import { HomeStep, ReviewStep } from './components/steps';
import { useUserBalances } from '@/hooks/use-user-balances';
import { useSwapActor } from '@/integrations/actor/use-swap-actor';
import {
  SwapStep,
  swapViewActions,
  useAppDispatch,
  useSwapViewStore,
} from '@/store';
import { parseResponseTokenList } from '@/utils/canister';

export const Swap = () => {
  const { step } = useSwapViewStore();
  const dispatch = useAppDispatch();

  const swapActor = useSwapActor();
  const { totalBalances } = useUserBalances();

  useEffect(() => {
    if (!swapActor) return;
    swapActor
      .getSupportedTokenList()
      .then((response) =>
        dispatch(swapViewActions.setTokenList(parseResponseTokenList(response)))
      )
      .catch((error) => {
        console.error('SwapActorError', error);
      });
  }, [swapActor]);

  const steps = {
    [SwapStep.Home]: <HomeStep balances={totalBalances} />,
    [SwapStep.Review]: <ReviewStep balances={totalBalances} />,
  };

  if (steps.hasOwnProperty(step)) {
    return steps[step];
  }

  return steps[SwapStep.Home];
};
