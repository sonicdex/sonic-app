import { Heading, Text, Flex } from '@chakra-ui/react';
import { depositSrc, swapSrc, withdrawSrc } from '@/assets';

import { ModalComponentProps } from '../modals';
import { SwapStep } from './components';

const STEPS = ['deposit', 'swap', 'withdraw'];

export const SwapProgress = ({
  currentModalState = 'deposit',
  currentModalData,
}: Partial<ModalComponentProps>) => {
  const { fromToken, toToken } = currentModalData;
  const getStepStatus = (step: string) => {
    const currentStepIndex = STEPS.indexOf(currentModalState);
    const stepIndex = STEPS.indexOf(step);

    if (currentStepIndex > stepIndex) return 'done';
    if (currentStepIndex === stepIndex) return 'active';

    return 'disabled';
  };

  return (
    <Flex
      direction="column"
      alignItems="center"
      width="wideModal"
      height="100%"
      bg="#1E1E1E"
      pt="37px"
      px="37px"
      pb="43px"
      borderRadius={20}
    >
      <Heading as="h1" color="#F6FCFD" fontWeight={700} fontSize={22} mb="13px">
        Swap in Progress
      </Heading>
      <Text as="p" color="#888E8F" mb="33px">
        Please allow a few seconds for swap to finish
      </Text>
      <Flex direction="row" justifyContent="center">
        <SwapStep
          status={getStepStatus('deposit')}
          iconSrc={depositSrc}
          chevron
        >
          Depositing <br /> {fromToken}
        </SwapStep>
        <SwapStep status={getStepStatus('swap')} iconSrc={swapSrc} chevron>
          Swapping <br /> {fromToken} to {toToken}
        </SwapStep>
        <SwapStep status={getStepStatus('withdraw')} iconSrc={withdrawSrc}>
          Withdrawing <br /> {toToken}
        </SwapStep>
      </Flex>
    </Flex>
  );
};
