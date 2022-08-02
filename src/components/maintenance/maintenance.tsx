import { Flex, Image, Link, Text, useColorModeValue } from '@chakra-ui/react';
import { FaBook } from '@react-icons/all-files/fa/FaBook';
import { FaDiscord } from '@react-icons/all-files/fa/FaDiscord';
import { FaTwitter } from '@react-icons/all-files/fa/FaTwitter';

import { logoSrc } from '@/assets';
import { ENV } from '@/config';

export const Maintenance = () => {
  const color = useColorModeValue('gray.600', 'gray.300');

  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
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
        <Text fontSize="4xl">Maintenance</Text>
        <Text fontSize="xl">
          Sonic App is under maintenance. We'll be back shortly.
        </Text>
        <Text color="dark-blue.500">
          <Link href={ENV.URLs.twitter} target={ENV.URLs.twitter}>
            Checkout out more information
          </Link>
        </Text>
      </Flex>

      <Flex
        m="5vh"
        flexDirection="row"
        justifyContent="space-around"
        alignItems="center"
        width={200}
        color={color}
      >
        <Link href={ENV.URLs.discord} target={ENV.URLs.discord}>
          <FaDiscord size={40} />
        </Link>
        <Link href={ENV.URLs.twitter} target={ENV.URLs.twitter}>
          <FaTwitter size={40} />
        </Link>
        <Link href={ENV.URLs.sonicDocs} target={ENV.URLs.sonicDocs}>
          <FaBook size={40} />
        </Link>
      </Flex>
    </Flex>
  );
};
