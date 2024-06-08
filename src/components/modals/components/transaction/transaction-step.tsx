import { Box, Flex, Icon, useColorModeValue } from '@chakra-ui/react';
import { FaChevronRight } from '@react-icons/all-files/fa/FaChevronRight';
import { useMemo } from 'react';

import { CircleIcon } from '@/components';

import { StepStatus } from '../..';

type TransactionStepProps = {
  children: React.ReactNode;
  status: StepStatus;
  iconSrc: string;
  chevron?: boolean;
};

export const TransactionStep = ({
  children,
  iconSrc,
  status,
  chevron = false,
}: TransactionStepProps) => {
  const colorDisabled = useColorModeValue('gray.600', 'custom.1');
  const colorEnabled = useColorModeValue('gray.800', 'white');

  const { color, weight, opacity } = useMemo(() => {
    if (status === StepStatus.Disabled) {
      return {
        color: colorDisabled,
        weight: 400,
        opacity: 0.4,
      };
    }

    return {
      color: colorEnabled,
      weight: 600,
      opacity: 1,
    };
  }, [colorDisabled, colorEnabled, status]);

  return (
    <>
      <Flex
        direction="row"
        alignItems="center"
        justifyContent="center"
       
      >
        <Flex direction="column" alignItems="center">
          <CircleIcon iconSrc={iconSrc} status={status} />
          <Flex
            mt={2}
            as="h3"
            fontWeight={weight}
            fontSize="0.875rem"
            color={color}
            textAlign="center"
            transition="color 400ms"
            flex={1}
            justifyContent="center"
           
            alignItems="center"
          >
            {children}
          </Flex>
        </Flex>
      </Flex>
      {chevron && (
        <Box>
          <Icon
            as={FaChevronRight}
            my={4}
            mx={2}
            opacity={opacity}
            transition="opacity 400ms"
           
          />
        </Box>
      )}
    </>
  );
};
