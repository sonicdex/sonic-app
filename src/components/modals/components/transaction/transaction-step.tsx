import { Image, Box, Flex } from '@chakra-ui/react';
import { CircleIcon } from '@/components';
import { doubleRightChevronSrc } from '@/assets';

type TransactionStepProps = {
  children: React.ReactNode;
  status: 'active' | 'disabled' | 'done';
  iconSrc: string;
  chevron?: boolean;
};

export const TransactionStep = ({
  children,
  iconSrc,
  status,
  chevron = false,
}: TransactionStepProps) => {
  const color = status === 'disabled' ? '#888E8F' : '#FFFFFF';
  const weight = status === 'disabled' ? 400 : 600;
  const opacity = status === 'disabled' ? 0.4 : 1;

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
