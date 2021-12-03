import { useState } from 'react';

import { HomeStep, DepositStep, WithdrawStep } from './steps';
import { SONIC_ASSETS_MOCK } from './mocks';

const getTokenFromAsset = (tokenName: string) => {
  const asset = SONIC_ASSETS_MOCK.filter((a) => a.name === tokenName)[0];

  return {
    name: asset.name,
    logo: asset.logo,
  };
};

enum AssetStep {
  Home,
  Deposit,
  Withdraw,
}

export const Assets = () => {
  const [step, setStep] = useState(AssetStep.Home);
  const [token, setToken] = useState(getTokenFromAsset('XTC'));

  const showInformation = true;

  const handleIncrement = (tokenName?: string) => {
    if (tokenName) {
      setToken(getTokenFromAsset(tokenName));
      setStep(AssetStep.Deposit);
    }
  };

  const handleDecrease = (tokenName?: string) => {
    if (tokenName) {
      setToken(getTokenFromAsset(tokenName));
      setStep(AssetStep.Withdraw);
    }
  };

  const steps = {
    [AssetStep.Home]: (
      <HomeStep
        handleIncrement={handleIncrement}
        handleDecrease={handleDecrease}
        showInformation={showInformation}
        sonicAssets={SONIC_ASSETS_MOCK}
      />
    ),
    [AssetStep.Deposit]: (
      <DepositStep token={token} onArrowBack={() => setStep(AssetStep.Home)} />
    ),
    [AssetStep.Withdraw]: (
      <WithdrawStep token={token} onArrowBack={() => setStep(AssetStep.Home)} />
    ),
  };

  if (steps.hasOwnProperty(step)) {
    return steps[step];
  }

  return steps[AssetStep.Home];
};
