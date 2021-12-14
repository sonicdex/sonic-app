import { Heading, Text, Flex, ModalCloseButton } from '@chakra-ui/react';
import { depositSrc, swapSrc, withdrawSrc } from '@/assets';

import { SwapStep } from './components';
import { ModalComponentProps } from '..';

export const SwapProgress = ({
  currentModalState,
  currentModalData,
}: Partial<ModalComponentProps>) => {
  const {
    fromToken,
    toToken,
    steps = ['deposit', 'swap', 'withdraw'],
  } = currentModalData;

  const getStepStatus = (step: string) => {
    const currentStepIndex = steps.indexOf(currentModalState || 'idle');
    const stepIndex = steps.indexOf(step);

    if (currentStepIndex > stepIndex) return 'done';
    if (currentStepIndex === stepIndex) return 'active';

    return 'disabled';
  };

  return (
    <Flex
      direction="column"
      alignItems="center"
      height="100%"
      bg="#1E1E1E"
      pt="37px"
      px="37px"
      pb="43px"
      borderRadius={20}
    >
      <ModalCloseButton position="absolute" top="10px" right="15px" />
      <Heading as="h1" color="#F6FCFD" fontWeight={700} fontSize={22} mb="13px">
        Swap in Progress
      </Heading>
      <Text as="p" color="#888E8F" mb="33px">
        Please allow a few seconds for swap to finish
      </Text>
      <Flex direction="row" justifyContent="center">
        {steps.includes('deposit') && (
          <SwapStep
            status={getStepStatus('deposit')}
            iconSrc={depositSrc}
            chevron
          >
            Depositing <br /> {fromToken}
          </SwapStep>
        )}
        <SwapStep
          status={getStepStatus('swap')}
          iconSrc={swapSrc}
          chevron={steps.includes('withdraw')}
        >
          Swapping <br /> {fromToken} to {toToken}
        </SwapStep>
        {steps.includes('withdraw') && (
          <SwapStep status={getStepStatus('withdraw')} iconSrc={withdrawSrc}>
            Withdrawing <br /> {toToken}
          </SwapStep>
        )}
      </Flex>
    </Flex>
  );
};
