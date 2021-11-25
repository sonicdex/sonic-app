import { useState } from 'react';
import { Box } from "@chakra-ui/react"

import { InformationBox, Header } from '@/components';
import { AddLiquidity } from './steps';

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

  const handleNextStep = () => setStep(step + 1);
  const handlePreviousStep = () => setStep(step - 1);

  const onClose = () => { console.log("Closed information"); setDisplayInformation(false); };

  if (step === 0) {
    return (
      <div>
        { displayInformation && (
          <InformationBox
            onClose={onClose}
            title={INFORMATION_TITLE}
            mb="37px"
          >
            <InformationDescription />
          </InformationBox>
        )}
        <Header
          title="Your Liquidity Positions"
          buttonText="Create Position"
          onButtonClick={handleNextStep}
        />
        <Box
          as="p"
          mt="35px"
          color="#888E8F"
          textAlign="center"
          fontWeight={700}
        >
          You have no liquidity positions
        </Box>
      </div>
    );
  }

  if (step === 1) {
    return (
      <AddLiquidity 
        onAdd={() => setStep(0)}
        onPrevious={handlePreviousStep}
      />
    );
  }
};
