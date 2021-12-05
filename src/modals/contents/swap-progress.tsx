import { Box, Flex, keyframes } from '@chakra-ui/react';
import {
  depositSrc,
  swapSrc,
  withdrawSrc,
  greenCheckSrc,
  doubleRightChevronSrc,
} from '@/assets';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const CircleIcon = ({
  status,
  iconSrc,
}: {
  status?: 'active' | 'disabled' | 'done';
  iconSrc: string;
}) => {
  const spinAnimation = `${spin} infinite 2s linear`;

  const bg = status === 'disabled' ? '#353535' : '#3D52F4';
  const opacity = status === 'disabled' ? 0.5 : 1;
  const checkOpacity = status === 'done' ? 1 : 0;

  return (
    <Box w="45px" h="45px" borderRadius="45px" position="relative" bg={bg}>
      {status === 'active' && (
        <Box
          w="45px"
          h="45px"
          borderRadius="45px"
          bg="#3D52F4"
          filter="blur(10px)"
          position="absolute"
        />
      )}
      {status === 'active' && (
        <Box
          w="100%"
          h="100%"
          borderRadius="45px"
          zIndex={200}
          border="2px solid #A8B2FF"
          borderTop="2px solid #FFFFFF"
          position="absolute"
          animation={spinAnimation}
        />
      )}
      <Box
        top={0}
        right={0}
        opacity={checkOpacity}
        mt="-5px"
        mr="-3px"
        zIndex={300}
        as="img"
        src={greenCheckSrc}
        transition="opacity 400ms"
        position="absolute"
      />
      <Flex
        w="100%"
        h="100%"
        borderRadius="45px"
        zIndex={200}
        alignItems="center"
        justifyContent="center"
        position="absolute"
        opacity={opacity}
        transition="opacity 400ms"
      >
        <Box as="img" w="18px" src={iconSrc} />
      </Flex>
    </Box>
  );
};

const Step = ({
  children,
  iconSrc,
  status,
  chevron = false,
}: {
  children: React.ReactNode;
  status: 'active' | 'disabled' | 'done';
  iconSrc: string;
  chevron?: boolean;
}) => {
  const color = status === 'disabled' ? '#888E8F' : '#FFFFFF';
  const weight = status === 'disabled' ? 400 : 600;
  const opacity = status === 'disabled' ? 0.4 : 1;
  const ml = status === 'disabled' ? (chevron ? '2px' : '3px') : '0px';
  const chevMl = status === 'disabled' ? '25px' : '24px';

  return (
    <Flex direction="row" alignItems="flex-start">
      <Flex direction="column" alignItems="center">
        <CircleIcon iconSrc={iconSrc} status={status} />
        <Box
          mt="9px"
          as="h3"
          pl={ml}
          fontWeight={weight}
          fontSize="14px"
          color={color}
          textAlign="center"
          transition="color 400ms"
        >
          {children}
        </Box>
      </Flex>
      {chevron && (
        <Box
          opacity={opacity}
          as="img"
          mt="15px"
          mx="24px"
          ml={chevMl}
          src={doubleRightChevronSrc}
          transition="opacity 400ms"
        />
      )}
    </Flex>
  );
};

const STEPS = ['deposit', 'swap', 'withdraw'];

type SwapProgressProps = {
  currentModalState?: string;
  currentModalData?: any;
};

export const SwapProgress = ({
  currentModalState,
  currentModalData,
}: SwapProgressProps) => {
  const { fromToken, toToken } = currentModalData;
  const getStepStatus = (step) => {
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
      width="441px"
      height="100%"
      bg="#1E1E1E"
      pt="37px"
      px="37px"
      pb="43px"
      borderRadius="20px"
    >
      <Box as="h1" color="#F6FCFD" fontWeight={700} fontSize="22px" mb="13px">
        Swap in Progress
      </Box>
      <Box as="p" color="#888E8F" fontSize="16px" mb="33px">
        Please allow a few seconds for swap to finish
      </Box>
      <Flex direction="row" justifyContent="center">
        <Step status={getStepStatus('deposit')} iconSrc={depositSrc} chevron>
          Depositing <br /> {fromToken}
        </Step>
        <Step status={getStepStatus('swap')} iconSrc={swapSrc} chevron>
          Swapping <br /> {fromToken} to {toToken}
        </Step>
        <Step status={getStepStatus('withdraw')} iconSrc={withdrawSrc}>
          Withdrawing <br /> {toToken}
        </Step>
      </Flex>
    </Flex>
  );
};
