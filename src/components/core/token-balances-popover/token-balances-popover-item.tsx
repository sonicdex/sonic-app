import { Flex, HStack, Image, Text } from '@chakra-ui/react';
import { FC, useMemo } from 'react';

import { questionMarkSrc } from '@/assets';
import { getAmountDividedByDecimals } from '@/utils/format';

type TokenBalancesPopoverItemProps = {
  src?: string;
  name?: string;
  balance?: number;
  symbol?: string;
  decimals?: number;
};

export const TokenBalancesPopoverItem: FC<TokenBalancesPopoverItemProps> = ({
  src = questionMarkSrc,
  symbol,
  balance,
  decimals,
  name,
}) => {
  const _balance = useMemo(
    () => getAmountDividedByDecimals(balance ?? 0, decimals).toString(),
    [balance, decimals]
  );

  return (
    <Flex justify="space-between" pb={3} _last={{ pb: 0 }}>
      <HStack flex={0} minWidth="fit-content">
        <Image src={src} boxSize={4} alt={`${symbol} logo`} />
        <Text>{name}</Text>
      </HStack>
      <Text textAlign="right" flex={1}>
        {_balance} {symbol}
      </Text>
    </Flex>
  );
};
