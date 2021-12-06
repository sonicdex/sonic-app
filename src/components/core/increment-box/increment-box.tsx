import { Box, Image, Flex } from '@chakra-ui/react';
import { greyMinusSrc, bluePlusSrc } from '@/assets';

type IncrementBoxProps = {
  mainImgSrc?: string;
  secondImg?: string;
  title?: string;
  children: any;
  onIncrement: () => any;
  onDecreace: () => any;
};

export const IncrementBox = ({
  mainImgSrc,
  secondImg,
  children,
  title,
  onIncrement,
  onDecreace,
}: IncrementBoxProps) => {
  const MainImg = <Image width="44px" height="44px" src={mainImgSrc} />;

  const SecondImg = (
    <Box width="44px" height="44px" position="relative">
      <Image
        position="absolute"
        width="30px"
        height="30px"
        top={0}
        left={0}
        src={mainImgSrc}
      />
      <Image
        position="absolute"
        width="30px"
        height="30px"
        bottom={0}
        right={0}
        src={secondImg}
      />
    </Box>
  );

  return (
    <Flex
      position="relative"
      direction="row"
      borderRadius="20px"
      alignItems="center"
      justifyContent="space-between"
      bg="#1E1E1E"
      px="20px"
      py="18px"
    >
      <Flex direction="row" alignItems="center" justifyContent="flex-start">
        {secondImg ? SecondImg : MainImg}
        <Box ml="16px" fontSize="18px" fontWeight={700} color="#F6FCFD" as="h3">
          {title}
        </Box>
      </Flex>
      {children}
      <Flex direction="row" alignItems="center">
        <Flex
          alignItems="center"
          justifyContent="center"
          onClick={onDecreace}
          border="1px solid #888E8F"
          width="40px"
          cursor="pointer"
          height="40px"
          borderRadius="40px"
        >
          <Image src={greyMinusSrc} />
        </Flex>
        <Flex
          ml="10px"
          alignItems="center"
          justifyContent="center"
          onClick={onIncrement}
          border="1px solid #3B50ED"
          width="40px"
          borderRadius="40px"
          cursor="pointer"
          height="40px"
        >
          <Image src={bluePlusSrc} />
        </Flex>
      </Flex>
    </Flex>
  );
};
