import { Box } from '@chakra-ui/react';

const SWAP_ERROR_LINK = '#';

const SwapError = () => (
  <Box
    color="#888E8F"
    fontSize="16px"
  >
    Since the swap failed, your assets are now deposited in Sonic, you can either retry the swap or <Box as="a" rel="noreferrer" target="_blank" href={SWAP_ERROR_LINK}textDecoration="underline">withdraw the assets</Box>.
  </Box>
);

export const ERROR_TYPES = {
  swap: "SWAP"
};

export const ERRORS = {
  [ERROR_TYPES.swap]: <SwapError />
};
