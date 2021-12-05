import { Box, Flex } from '@chakra-ui/react';

type ToggleProps = {
  toggle: boolean;
  onToggle: () => any;
};

export const Toggle = ({ toggle, onToggle }: ToggleProps) => (
  <Flex
    direction="row"
    cursor="pointer"
    p={1.5}
    bg="#1E1E1E"
    width="fit-content"
    borderRadius={100}
    position="relative"
    alignItems="center"
    onClick={() => onToggle()}
  >
    <Box
      height={10}
      width="63px"
      bg="linear-gradient(108.08deg, #3D52F4 0%, #192985 100%)"
      borderRadius={100}
      position="absolute"
      marginLeft={toggle ? '0px' : '63px'}
      transition="margin 400ms"
    />
    <Box
      width="63px"
      textAlign="center"
      py={2}
      borderRadius={100}
      fontWeight={700}
      fontSize="md"
      zIndex={100}
    >
      Yes
    </Box>
    <Box
      width="63px"
      textAlign="center"
      py={2}
      borderRadius={100}
      fontWeight={700}
      fontSize="md"
      zIndex={100}
    >
      No
    </Box>
  </Flex>
);
