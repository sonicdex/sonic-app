import { questionMarkSrc } from '@/assets';
import { TokenMetadata } from '@/models';
import { Image } from '@chakra-ui/image';
import { Box, Flex, HStack, Text } from '@chakra-ui/layout';
import { FC } from 'react';
import NumberFormat from 'react-number-format';

type RemoveLiquidityModalAssetProps = Partial<TokenMetadata> & {
  balance: string;
  price: number;
};

export const RemoveLiquidityModalAsset: FC<RemoveLiquidityModalAssetProps> = ({
  symbol,
  logo = questionMarkSrc,
  balance = 0,
  price = 0,
}) => {
  return (
    <Flex justifyContent="space-between">
      <HStack
        pl={2}
        py={2}
        pr={4}
        bg="gray.700"
        borderRadius="full"
        alignSelf="center"
      >
        <Image src={logo} alt={symbol} boxSize={6} borderRadius="full" />
        <Text fontWeight="bold">{symbol}</Text>
      </HStack>
      <Box textAlign="end">
        <Text fontSize="xl" fontWeight="bold">
          <NumberFormat value={balance} displayType="text" />
        </Text>
        <Text fontSize="xs">
          ~
          <NumberFormat
            value={price}
            displayType="text"
            prefix="$"
            decimalScale={0}
          />
        </Text>
      </Box>
    </Flex>
  );
};
