import { Flex, HStack, Image, Text } from '@chakra-ui/react';
import { FC } from 'react';

import { questionMarkSrc } from '@/assets';

import { DisplayValue } from '..';
import { LPBreakdown } from '.';

type LPBreakdownPopoverItemProps = LPBreakdown;

export const LPBreakdownPopoverItem: FC<LPBreakdownPopoverItemProps> = ({
  src = questionMarkSrc,
  balance,
  symbol,
  decimals,
}) => {
  return (
    <Flex justify="space-between" pb={3} _last={{ pb: 0 }}>
      <HStack flex={0} minWidth="fit-content">
        <Image src={src} boxSize={4} alt={`${symbol} logo`} />
        <Text>{symbol}</Text>
      </HStack>
      <DisplayValue
        textAlign="right"
        flex={1}
        value={balance}
        decimals={decimals}
        shouldGetRealAmount={false}
        suffix={` ${symbol}`}
      />
    </Flex>
  );
};
