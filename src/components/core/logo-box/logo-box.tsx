import { Stack, Text } from '@chakra-ui/layout';
import { useColorModeValue , Link} from '@chakra-ui/react';
import { Logo } from '../logo';

export const LogoBox = () => {
  const stackBg = useColorModeValue('gray.50', 'custom.2');
  const shadow = useColorModeValue('base', 'none');

  return (
    <Link href={'/'} style={{ textDecoration: "none" , boxShadow:'none'}}>
      <Stack direction="row" align="center" bg={stackBg} shadow={shadow} px={4} h="12" borderRadius="full" userSelect="none">
        <Logo w="5" h="7" />
      <Text fontWeight="bold">Sonic</Text>
    </Stack>
    </Link>
  );
};
