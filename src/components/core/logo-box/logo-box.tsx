import { Stack, Text } from '@chakra-ui/layout';
import { useColorModeValue } from '@chakra-ui/react';

import { Logo } from '../logo';

export const LogoBox = () => {
  const stackBg = useColorModeValue('gray.100', 'gray.800');

  return (
    <Stack
      direction="row"
      align="center"
      bg={stackBg}
      px="5"
      h="12"
      borderRadius="full"
      userSelect="none"
    >
      <Logo w="5" h="7" />
      <Text>Sonic</Text>
    </Stack>
  );
};
