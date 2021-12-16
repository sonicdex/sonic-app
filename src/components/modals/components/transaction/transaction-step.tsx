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
  const ml = status === 'disabled' ? (chevron ? 1 : 1.5) : 0;

  return (
    <Flex direction="row" alignItems="flex-start">
      <Flex direction="column" alignItems="center">
        <CircleIcon iconSrc={iconSrc} status={status} />
        <Box
          mt={2}
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
        <Image
          src={doubleRightChevronSrc}
          mt={4}
          mx={6}
          ml={6}
          opacity={opacity}
          transition="opacity 400ms"
        />
      )}
    </Flex>
  );
};
