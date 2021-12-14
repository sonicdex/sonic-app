import { Flex, Image } from '@chakra-ui/react';
import { questionMarkSrc } from '@/assets';

type ImportTokenImageProps = {
  logo?: string;
};

export const TokenImg = ({ logo = questionMarkSrc }: ImportTokenImageProps) => {
  if (logo === questionMarkSrc) {
    return (
      <Flex
        borderRadius={26}
        bg="#6B7280"
        w={10}
        h={10}
        alignItems="center"
        justifyContent="center"
      >
        <Image w={6} h={6} src={logo} />
      </Flex>
    );
  }

  return <Image borderRadius={26} w={10} h={10} src={logo} />;
}
