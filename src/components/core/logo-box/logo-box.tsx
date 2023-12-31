import { Stack } from '@chakra-ui/layout';
import { useColorModeValue , Link ,Image} from '@chakra-ui/react';
// import { Logo , } from '../logo';

export const LogoBox = () => {
  const stackBg = useColorModeValue('gray.50', 'custom.2');
  const shadow = useColorModeValue('base', 'none');

  return (
    <Link href={'/'} style={{ textDecoration: "none" , boxShadow:'none'}}>
      <Stack direction="row" align="center" bg={stackBg} shadow={shadow} px={4} h="12" borderRadius="full" userSelect="none" position={'relative'}>
        <Image src='/hat.png' position={'absolute'} zIndex={2} w={'28px'} left={'8px'} top={'4px'}></Image>
        <Image src='/logo.svg' position={'relative'} zIndex={1}></Image>
    </Stack>
    </Link>
  );
};
