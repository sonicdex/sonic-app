import { useState } from 'react';

import { useAppSelector, selectPlugState } from '@/store';
import { infoSrc } from '@/assets';
import { HomeStep, ReviewStep } from './steps';

// Mocked
const tokenOptions = {
  'XMPL': {
    img: infoSrc,
    name: 'XMPL',
  },
  'XMP2': {
    img: infoSrc,
    name: 'XMP2',
  },
  'XMP3': {
    img: infoSrc,
    name: 'XMP3',
  },
};

const STEPS = [
  HomeStep,
  ReviewStep,
];

export const Swap = () => {
  const [step, setStep] = useState(0);

  const { isConnected } = useAppSelector(selectPlugState);
  const [keepInSonic, setKeepInSonic] = useState(false);
  const [fromValue, setFromValue] = useState('0.00');
  const [fromToken, setFromToken] = useState(Object.values(tokenOptions)[0]);
  const [toValue, setToValue] = useState('0.00');
  const [toToken, setToToken] = useState(Object.values(tokenOptions)[1]);

  const [modalOpen, setModalOpen] = useState(true);

  const handleTokenSelect = (tokenName, setter) => {
    setter(tokenOptions[tokenName]);
  };

  const handleNextStep = () => {
    if ((step + 1) < STEPS.length) {
      setStep(step + 1);
    } else {
      setStep(0);
    }
  };

  const handlePrevStep = () => {
    if ((step - 1) >= 0) {
      setStep(step - 1);
    }
  };

  switch (step) {
    case 0:
      return (
        <HomeStep
          handleTokenSelect={handleTokenSelect}
          fromValue={fromValue}
          fromToken={fromToken}
          toValue={toValue}
          toToken={toToken}
          setFromValue={setFromValue}
          setFromToken={setFromToken}
          setToValue={setToValue}
          setToToken={setToToken}
          tokenOptions={tokenOptions}
          nextStep={handleNextStep}
        />
      )
      break;
    case 1:
      return (
        <ReviewStep
          keepInSonic={keepInSonic}
          setKeepInSonic={setKeepInSonic}
          fromValue={fromValue}
          toValue={toValue}
          fromToken={fromToken}
          toToken={toToken}
          nextStep={handleNextStep}
          prevStep={handlePrevStep}
          tokenOptions={tokenOptions}
        />
      )
      break;
  }
};
