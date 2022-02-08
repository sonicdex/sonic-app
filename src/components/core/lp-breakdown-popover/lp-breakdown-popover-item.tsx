import { Flex, HStack, Image, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { FC, useMemo } from 'react';

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
  const _balance = useMemo(() => {
    return new BigNumber(balance ?? 0).dp(decimals).toString();
  }, [balance, decimals]);

  return (
    <Flex justify="space-between" pb={3} _last={{ pb: 0 }}>
      <HStack flex={0} minWidth="fit-content">
        <Image src={src} boxSize={4} alt={`${symbol} logo`} />
        <Text>{symbol}</Text>
      </HStack>
      <DisplayValue
        textAlign="right"
        flex={1}
        value={_balance}
        suffix={` ${symbol}`}
      />
    </Flex>
  );
};
