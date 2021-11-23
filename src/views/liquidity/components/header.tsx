import { Box, Flex } from "@chakra-ui/react"
import { Button } from '@/components';

export const Header = () => {
  return (
    <Flex
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      pb="16px"
      mb="20px"
      borderBottom="1px solid #373737"
    >
      <Box
        as="h3"
        fontSize="18px"
        fontWeight={700}
        color="#F6FCFD"
      >
        Your Liquidity Positions
      </Box>
      <Button
        title="Create Position"
        size="fit"
        onClick={() => { console.log('should create position')}}
      />
    </Flex>
  );
};
