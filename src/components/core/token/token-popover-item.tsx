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
    <Flex justify="space-between">
      <HStack>
        <Image src={src} boxSize={4} />
        <Text>{name}</Text>
      </HStack>
      <Text>
        {getCurrencyString(balance, decimals)} {symbol}
      </Text>
    </Flex>
  );
};
