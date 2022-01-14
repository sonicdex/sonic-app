import { Flex, Image, Link, Text } from '@chakra-ui/react';
import { FaBook } from '@react-icons/all-files/fa/FaBook';
import { FaDiscord } from '@react-icons/all-files/fa/FaDiscord';
import { FaTwitter } from '@react-icons/all-files/fa/FaTwitter';

import { logoSrc } from '@/assets';

export const EmptyMobile = () => {
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Image src={logoSrc} m="8vh" height="10vh" />

      <Flex
        flex={1}
        m={30}
        textAlign="center"
        verticalAlign="center"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Text fontSize="4xl">Desktop only</Text>
        <Text fontSize="xl">
          The Sonic app is not supported on mobile devices, please switch to
          desktop browser.
        </Text>
      </Flex>

      <Flex
        m="5vh"
        flexDirection="row"
        justifyContent="space-around"
        alignItems="center"
        width={200}
        color="gray.300"
      >
        <Link href="https://discord.gg/EkmnRd99h6" target="_blank">
          <FaDiscord size={40} />
        </Link>
        <Link href="https://twitter.com/sonic_ooo" target="_blank">
          <FaTwitter size={40} />
        </Link>
        <Link href="https://docs.sonic.ooo/" target="_blank">
          <FaBook size={40} />
        </Link>
      </Flex>
    </Flex>
  );
};
