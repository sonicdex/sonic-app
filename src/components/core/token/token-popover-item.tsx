import { FC } from 'react';
import { Flex, HStack, Text, Image } from '@chakra-ui/react';

import { questionMarkSrc } from '@/assets';
import { getCurrencyString } from '@/utils/format';

type TokenPopoverItemProps = {
  src?: string;
  name?: string;
  balance?: number;
  symbol?: string;
  decimals?: number;
};

export const TokenPopoverItem: FC<TokenPopoverItemProps> = ({
  src = questionMarkSrc,
  symbol,
  balance,
  decimals,
  name,
}) => {
  return (
    <Flex justify="space-between" py={2}>
      <HStack flex={0} minWidth="fit-content">
        <Image src={src} boxSize={4} />
        <Text>{name}</Text>
      </HStack>
      <Text textAlign="right" flex={1}>
        {getCurrencyString(balance, decimals)} {symbol}
      </Text>
    </Flex>
  );
};
