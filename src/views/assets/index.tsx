import { useState } from 'react';

import { ASSETS } from '@/constants';

import { HomeStep, DepositStep, WithdrawStep } from './steps';

// Mocked
const SonicAssets = [
  {
    name: 'XTC',
    amount: '400',
    price: '$23.231',
    img: ASSETS.XTC.img,
  },
  {
    name: 'WICP',
    amount: '100',
    price: '$43.231',
    img: ASSETS.WICP.img,
  },
  {
    name: 'ICP',
    amount: '200',
    price: '$93.231',
    img: ASSETS.ICP.img,
  },
];

const getTokenFromAsset = (tokenName) => {
  const asset = SonicAssets.filter((a) => a.name === tokenName)[0];

  return {
    name: asset.name,
    img: asset.img,
  };
};

export const Assets = () => {
  const [step, setStep] = useState('home');
  const [token, setToken] = useState(getTokenFromAsset('XTC'));

  const showInformation = true;

  const handleIncrement = (tokenName) => {
    setToken(getTokenFromAsset(tokenName));
    setStep('deposit');
  };

  const handleDecrease = (tokenName) => {
    setToken(getTokenFromAsset(tokenName));
    setStep('withdraw');
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
      break;
  }
};
