import { Flex, Box } from '@chakra-ui/react';

type AssetContentProps = {
  price: string,
  amount: string,
}

export const AssetContent = ({ price, amount }: AssetContentProps) => (
  <Flex
    position="absolute"
    left="201px"
    direction="row"
  >
    <Flex direction="column" alignItems="center">
      <Box as="h4" color="#888E8F" fontSize="16px" mb="4px">
        Amount
      </Box>
      <Box as="p" color="#F6FCFD" fontSize="18px" fontWeight={700}>
        {amount}
      </Box>
    </Flex>
    <Flex direction="column" alignItems="center" ml="88px">
      <Box as="h4" color="#888E8F" fontSize="16px" mb="4px">
        Price
      </Box>
      <Box as="p" color="#F6FCFD" fontSize="18px" fontWeight={700}>
        {price}
      </Box>
    </Flex>
  </Flex>
);
