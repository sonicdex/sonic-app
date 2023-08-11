import { Flex, HStack, Image, Text } from '@chakra-ui/react';
import { FC } from 'react';

import { questionMarkSrc } from '@/assets';

import { LPBreakdown } from '.';

type LPBreakdownPopoverItemProps = LPBreakdown;

export const LPBreakdownPopoverItem: FC<LPBreakdownPopoverItemProps> = ({ src = questionMarkSrc, balance, symbol }) => {
  return (
    <Flex justify="space-between" pb={3} _last={{ pb: 0 }}>
      <HStack flex={0} minWidth="fit-content">
        <Image src={src} boxSize={4} alt={`${symbol} logo`} />
        <Text> {balance}&nbsp;{symbol}</Text>
      </HStack>
    </Flex>
  );
};
