import { questionMarkSrc } from '@/assets';
import { Image } from '@chakra-ui/image';
import { Box, Flex, HStack, Text } from '@chakra-ui/layout';
import { FC } from 'react';
import NumberFormat from 'react-number-format';

type RemoveLiquidityModalAssetProps = {
  name: string;
  src?: string;
  amount?: number;
  price?: number;
};

export const RemoveLiquidityModalAsset: FC<RemoveLiquidityModalAssetProps> = ({
  name,
  src = questionMarkSrc,
  amount = 0,
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
        <Image src={src} alt={name} boxSize={6} borderRadius="full" />
        <Text fontWeight="bold">{name}</Text>
      </HStack>
      <Box textAlign="end">
        <Text fontSize="xl" fontWeight="bold">
          <NumberFormat value={amount} displayType="text"></NumberFormat>
        </Text>
        <Text fontSize="xs">
          <NumberFormat value={amount} displayType="text" prefix="$">
            {price}
          </NumberFormat>
        </Text>
      </Box>
    </Flex>
  );
};
