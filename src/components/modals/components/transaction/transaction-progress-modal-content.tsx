import {
  Heading,
  Text,
  Flex,
  ModalContent,
  ModalContentProps,
} from '@chakra-ui/react';
import { depositSrc, swapSrc, withdrawSrc } from '@/assets';
import { TransactionStep } from '.';
import React from 'react';

export const TransactionProgressModalContent: React.FC<ModalContentProps> = ({
  children,
  ...props
}) => {
  const batchData = {};

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
    <ModalContent
      as={Flex}
      direction="column"
      alignItems="center"
      height="100%"
      bg="#1E1E1E"
      pt="37px"
      px="37px"
      pb="43px"
      borderRadius={20}
      {...props}
    >
      <Heading as="h1" color="#F6FCFD" fontWeight={700} fontSize={22} mb={3}>
        Swap in Progress
      </Heading>
      <Text as="p" color="#888E8F" mb="33px">
        Please allow a few seconds for swap to finish
      </Text>
      <Flex direction="row" justifyContent="center">
        {steps.includes('deposit') && (
          <TransactionStep
            status={getStepStatus('deposit')}
            iconSrc={depositSrc}
            chevron
          >
            Depositing <br /> {fromToken}
          </TransactionStep>
        )}
        <TransactionStep
          status={getStepStatus('swap')}
          iconSrc={swapSrc}
          chevron={steps.includes('withdraw')}
        >
          Swapping <br /> {fromToken} to {toToken}
        </TransactionStep>
        {steps.includes('withdraw') && (
          <TransactionStep
            status={getStepStatus('withdraw')}
            iconSrc={withdrawSrc}
          >
            Withdrawing <br /> {toToken}
          </TransactionStep>
        )}
        {children}
      </Flex>
    </ModalContent>
  );
};
