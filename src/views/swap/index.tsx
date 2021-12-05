import { useState } from 'react';

import { useAppSelector, selectPlugState } from '@/store';
import { HomeStep, ReviewStep } from './steps';
import { ASSETS } from '@/constants';

const STEPS = [HomeStep, ReviewStep];

export const Swap = () => {
  const [step, setStep] = useState(0);

  const { isConnected } = useAppSelector(selectPlugState);
  const [keepInSonic, setKeepInSonic] = useState(false);
  const [fromValue, setFromValue] = useState('0.00');
  const [fromToken, setFromToken] = useState(Object.values(ASSETS)[0]);
  const [toValue, setToValue] = useState('0.00');
  const [toToken, setToToken] = useState(Object.values(ASSETS)[1]);

  const [modalOpen, setModalOpen] = useState(true);

  const handleTokenSelect = (tokenName, setter) => {
    const filledTokenName = ASSETS[tokenName];

    switch (tokenName) {
      case fromToken.name:
        setFromToken(toToken);
        setToToken(filledTokenName);
        break;
      case toToken.name:
        setToToken(fromToken);
        setFromToken(filledTokenName);
        break;
      default:
        setter(filledTokenName);
        break;
    }
  };

  const handleNextStep = () => {
    if (step + 1 < STEPS.length) {
      setStep(step + 1);
    } else {
      setStep(0);
    }
  };

  const handlePrevStep = () => {
    if (step - 1 >= 0) {
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
          tokenOptions={ASSETS}
          nextStep={handleNextStep}
        />
      );
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
          setFromValue={setFromValue}
          tokenOptions={ASSETS}
        />
      );
      break;
  }
};
