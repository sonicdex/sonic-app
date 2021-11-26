import { Box } from '@chakra-ui/react';

import { InformationBox, Header } from '@/components';

const INFORMATION_TITLE = 'Liquidity Provider Rewards';
const INFORMATION_DESCRIPTION =
  'Liquidity providers earn a 0.25% fee on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity. If you want to learn ';

type HomeStepProps = {
  displayInformation: boolean;
  onCloseInformation: () => any;
  nextStep: () => any;
  prevStep: () => any;
};

const InformationDescription = () => (
  <Box as="p" color="#888E8F" fontSize="16px">
    {INFORMATION_DESCRIPTION}
    <Box
      as="a"
      color="#888E8F"
      href="#"
      textDecoration="underline"
      _visited={{
        color: '#888E8F',
      }}
    >
      review our blog post
    </Box>
    .
  </Box>
);

export const HomeStep = ({
  displayInformation,
  onCloseInformation,
  nextStep,
  prevStep,
}: HomeStepProps) => (
  <div>
    {displayInformation && (
      <InformationBox
        onClose={onCloseInformation}
        title={INFORMATION_TITLE}
        mb="37px"
      >
        <InformationDescription />
      </InformationBox>
    )}
    <Header
      title="Your Liquidity Positions"
      buttonText="Create Position"
      onButtonClick={nextStep}
    />
    <Box as="p" mt="35px" color="#888E8F" textAlign="center" fontWeight={700}>
      You have no liquidity positions
    </Box>
  </div>
);
