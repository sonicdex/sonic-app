import { Box, Flex, Image } from '@chakra-ui/react';
import { useMemo } from 'react';

import { doubleRightChevronSrc } from '@/assets';
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
  const { color, weight, opacity } = useMemo(() => {
    if (status === StepStatus.Disabled) {
      return {
        color: '#888E8F',
        weight: 400,
        opacity: 0.4,
      };
    }

    return {
      color: '#FFFFFF',
      weight: 600,
      opacity: 1,
    };
  }, [status]);

  return (
    <>
      <Flex direction="row" alignItems="flex-start">
        <Flex direction="column" alignItems="center">
          <CircleIcon iconSrc={iconSrc} status={status} />
          <Box
            mt={2}
            as="h3"
            fontWeight={weight}
            fontSize="14px"
            color={color}
            textAlign="center"
            transition="color 400ms"
          >
            {children}
          </Box>
        </Flex>
      </Flex>
      {chevron && (
        <Box>
          <Image
            alt="next transaction"
            src={doubleRightChevronSrc}
            m={4}
            opacity={opacity}
            transition="opacity 400ms"
          />
        </Box>
      )}
    </>
  );
};
