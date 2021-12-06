import { AssetStep, useAssetsViewStore } from '@/store';

import { HomeStep, DepositStep, WithdrawStep } from './components/steps';

export const Assets = () => {
  const { step } = useAssetsViewStore();

  const steps = {
    [AssetStep.Home]: <HomeStep />,
    [AssetStep.Deposit]: <DepositStep />,
    [AssetStep.Withdraw]: <WithdrawStep />,
  };

  if (steps.hasOwnProperty(step)) {
    return steps[step];
  }

  return steps[AssetStep.Home];
};
