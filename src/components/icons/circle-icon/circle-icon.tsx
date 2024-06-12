import {
  Box,
  Flex,
  Image,
  keyframes,
  useColorModeValue,
} from '@chakra-ui/react';

import { greenCheckSrc } from '@/assets';
import { StepStatus } from '@/components/modals';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

type CircleIconProps = {
  status?: StepStatus;
  iconSrc: string;
};

export const CircleIcon = ({ status, iconSrc }: CircleIconProps) => {
  const spinAnimation = `${spin} infinite 2s linear`;

  const bgDark = status === StepStatus.Disabled ? 'custom.3' : 'green.500';
  const bgLight = status === StepStatus.Disabled ? 'gray.200' : 'green.500';
  const bg = useColorModeValue(bgLight, bgDark);

  const opacity = status === StepStatus.Disabled ? 0.5 : 1;
  const checkOpacity = status === StepStatus.Done ? 1 : 0;

  return (
    <Box
      w="2.8125rem"
      h="2.8125rem"
      borderRadius="2.8125rem"
      position="relative"
      bg={bg}
    
    >
      {status === 'active' && (
        <Box
          w="2.8125rem"
          h="2.8125rem"
          borderRadius={45}
          bg="green"
          filter="blur(10px)"
          position="absolute"
        />
      )}
      {status === 'active' && (
        <Box
          w="100%"
          h="100%"
          borderRadius="2.8125rem"
          zIndex={200}
          bg="green"
          border="2px solid #A8B2FF"
          borderTop="2px solid #FFFFFF"
          position="absolute"
          animation={spinAnimation}
        />
      )}
      <Image
        alt={'check'}
        top={0}
        right={0}
        opacity={checkOpacity}
        mt="-5px"
        mr="-3px"
        zIndex={300}
        src={greenCheckSrc}
        transition="opacity 400ms"
        position="absolute"
      />
      <Flex
        w="100%"
        h="100%"
        borderRadius="2.8125rem"
        zIndex={200}
        alignItems="center"
        justifyContent="center"
        position="absolute"
        opacity={opacity}
        transition="opacity 400ms"
        bg="green"
      >
        <Image w="1.125rem" src={iconSrc} alt={'icon'} />
      </Flex>
    </Box>
  );
};
