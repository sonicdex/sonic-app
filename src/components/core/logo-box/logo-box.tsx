import { Stack, Text } from '@chakra-ui/layout';
import { useColorModeValue } from '@chakra-ui/react';

import { Logo } from '../logo';

export const LogoBox = () => {
  const stackBg = useColorModeValue('gray.50', 'gray.800');
  const shadow = useColorModeValue('sm', 'none');

  return (
    <Stack
      direction="row"
      align="center"
      bg={stackBg}
      shadow={shadow}
      px="5"
      h="12"
      borderRadius="full"
      userSelect="none"
    >
      <Logo w="5" h="7" />
      <Text fontWeight="bold">Sonic</Text>
    </Stack>
  );
};
