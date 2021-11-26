import { useState } from 'react';
import { Box } from "@chakra-ui/react"

import { InformationBox, Header } from '@/components';
import { HomeStep, AddLiquidityStep } from './steps';

const STEPS = [
  HomeStep,
  AddLiquidityStep,
];

const INFORMATION_TITLE = 'Liquidity Provider Rewards';
const INFORMATION_DESCRIPTION = 'Liquidity providers earn a 0.25% fee on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity. If you want to learn ';

const InformationDescription = () => (
  <Box as="p" color="#888E8F" fontSize="16px">
    {INFORMATION_DESCRIPTION}
    <Box
      as="a"
      color="#888E8F"
      href="#"
      textDecoration='underline'
      _visited={{
        color: '#888E8F',
      }}
      >review our blog post</Box>.
  </Box>
);

export const Liquidity = () => {
  const [step, setStep] = useState(0);
  const [displayInformation, setDisplayInformation] = useState(true);

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

  const onClose = () => { console.log("Closed information"); setDisplayInformation(false); };

  switch(step) {
    case 0:
      return (
        <HomeStep
          displayInformation={displayInformation}
          onCloseInformation={onClose}
          nextStep={handleNextStep}
          prevStep={handlePrevStep}
        />
      );
      break;
    case 1:
      return (
        <AddLiquidityStep
          onAdd={() => setStep(0)}
          onPrevious={handlePrevStep}
        />
      );
      break;
  }
};
