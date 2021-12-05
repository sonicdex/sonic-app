import {
  IconButton,
  FlexProps,
  HStack,
  Box,
  Image,
  Flex,
} from '@chakra-ui/react';
import { greyMinusSrc } from '@/assets';
import { PlusIcon } from '@/components/icons';

type AssetProps = FlexProps & {
  mainImgSrc?: string;
  secondImg?: string;
  title?: string;
  children: any;
  onAdd: () => any;
  onRemove: () => any;
};

export const Asset = ({
  mainImgSrc,
  secondImg,
  children,
  title,
  onAdd,
  onRemove,
  ...props
}: AssetProps) => {
  const MainImg = <Image width={10} height={10} src={mainImgSrc} />;

  const SecondImg = (
    <Box width={10} height={10} position="relative">
      <Image
        position="absolute"
        width={8}
        height={8}
        top={0}
        left={0}
        src={mainImgSrc}
      />
      <Image
        position="absolute"
        width={8}
        height={8}
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
      borderRadius="xl"
      alignItems="center"
      justifyContent="space-between"
      bg="#1E1E1E"
      px={5}
      py={4}
      {...props}
    >
      <Flex direction="row" alignItems="center" justifyContent="flex-start">
        {secondImg ? SecondImg : MainImg}
        <Box ml={4} fontSize="lg" fontWeight={700} color="#F6FCFD" as="h3">
          {title}
        </Box>
      </Flex>
      {children}
      <HStack>
        <IconButton
          icon={<Image src={greyMinusSrc} />}
          aria-label="Left icon"
          isRound
          variant="outline"
          onClick={onRemove}
        />
        <IconButton
          icon={<PlusIcon />}
          aria-label="Right icon"
          isRound
          variant="outline"
          onClick={onAdd}
        />
      </HStack>
    </Flex>
  );
};
