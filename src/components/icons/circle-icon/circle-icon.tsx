import { Box, Flex, Image, keyframes } from '@chakra-ui/react';

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

  const bg = status === StepStatus.Disabled ? '#353535' : '#3D52F4';
  const opacity = status === StepStatus.Disabled ? 0.5 : 1;
  const checkOpacity = status === StepStatus.Done ? 1 : 0;

  return (
    <Box w="45px" h="45px" borderRadius="45px" position="relative" bg={bg}>
      {status === 'active' && (
        <Box
          w="45px"
          h="45px"
          borderRadius={45}
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
      <Image
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
        borderRadius="45px"
        zIndex={200}
        alignItems="center"
        justifyContent="center"
        position="absolute"
        opacity={opacity}
        transition="opacity 400ms"
      >
        <Image w="18px" src={iconSrc} />
      </Flex>
    </Box>
  );
};
