import { Image } from '@chakra-ui/image';
import { Box, Flex, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import { Price } from '@memecake/sonic-js';
import { FC, useMemo } from 'react';

import { questionMarkSrc } from '@/assets';
import { DisplayValue } from '@/components';
import { AppTokenMetadata } from '@/models';

type RemoveLiquidityModalAssetProps = Partial<AppTokenMetadata> & {
  balance: string;
  isUpdating?: boolean;
};

export const RemoveLiquidityModalAsset: FC<RemoveLiquidityModalAssetProps> = ({
  symbol,
  decimals,
  logo = questionMarkSrc,
  balance = 0,
  price = 0,
  isUpdating,
}) => {
  const balancePrice = useMemo(
    () => Price.getByAmount({ amount: String(balance), price }).toString(),
    [balance, price]
  );

  const bg = useColorModeValue('gray.100', 'gray.700');

  return (
    <Flex justifyContent="space-between">
      <HStack pl={2} py={2} pr={4} bg={bg} borderRadius="full" alignSelf="center">
        <Image src={logo} alt={symbol} boxSize={6} borderRadius="full" />
        <Text fontWeight="bold">{symbol}</Text>
      </HStack>
      <Box textAlign="end">
        <Box fontSize="xl" fontWeight="bold">
          <DisplayValue value={balance} isUpdating={isUpdating} decimals={decimals}/>
        </Box>
        <Box fontSize="xs">
          <DisplayValue value={balancePrice} prefix="~$" isUpdating={isUpdating}/>
        </Box>
      </Box>
    </Flex>
  );
};
