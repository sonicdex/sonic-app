import { Image, Box, Flex } from '@chakra-ui/react';
import { CircleIcon } from '@/components';
import { doubleRightChevronSrc } from '@/assets';

export const SwapStep = ({
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
        <Image
          opacity={opacity}
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
