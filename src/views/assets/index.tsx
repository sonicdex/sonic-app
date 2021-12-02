import { useState } from 'react';

import { TOKEN } from '@/constants';

import { HomeStep, DepositStep, WithdrawStep } from './steps';
import { SupportedToken } from '@/models';

// Mocked
const SonicAssets: Partial<SupportedToken>[] = [
  {
    name: 'XTC',
    totalSupply: BigInt(400),
    logo: TOKEN.XTC.logo,
  },
  {
    name: 'WICP',
    totalSupply: BigInt(100),
    logo: TOKEN.WICP.logo,
  },
  {
    name: 'ICP',
    totalSupply: BigInt(200),
    logo: TOKEN.ICP.logo,
  },
];

const getTokenFromAsset = (tokenName: string) => {
  const asset = SonicAssets.filter((a) => a.name === tokenName)[0];

  return {
    name: asset.name,
    logo: asset.logo,
  };
};

export const Assets = () => {
  const [step, setStep] = useState('home');
  const [token, setToken] = useState(getTokenFromAsset('XTC'));

  const showInformation = true;

  const handleIncrement = (tokenName?: string) => {
    if (tokenName) {
      setToken(getTokenFromAsset(tokenName));
      setStep('deposit');
    }
  };

  const handleDecrease = (tokenName?: string) => {
    if (tokenName) {
      setToken(getTokenFromAsset(tokenName));
      setStep('withdraw');
    }
  };

  switch (step) {
    case 'home':
      return (
        <HomeStep
          handleIncrement={handleIncrement}
          handleDecrease={handleDecrease}
          showInformation={showInformation}
          sonicAssets={SonicAssets}
        />
      );
    case 'deposit':
      return <DepositStep token={token} onArrowBack={() => setStep('home')} />;
    case 'withdraw':
      return <WithdrawStep token={token} onArrowBack={() => setStep('home')} />;
    default:
      setStep('home');
      return null;
      break;
  }
};
