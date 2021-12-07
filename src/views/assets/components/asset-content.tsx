import { Text, Flex, Box } from '@chakra-ui/react';

type AssetContentProps = {
  price: string;
  amount: string;
};

export const AssetContent = ({ price, amount }: AssetContentProps) => (
  <Flex position="absolute" left={48} direction="row">
    <Flex direction="column" alignItems="center">
      <Box as="h4" color="#888E8F" mb={1}>
        Amount
      </Box>
      <Text color="#F6FCFD" fontWeight={700}>
        {amount}
      </Text>
    </Flex>
    <Flex direction="column" alignItems="center" ml={20}>
      <Box as="h4" color="#888E8F" mb={1}>
        Price
      </Box>
      <Text color="#F6FCFD" fontWeight={700}>
        {price}
      </Text>
    </Flex>
  </Flex>
);
