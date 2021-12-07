import {
  IconButton,
  FlexProps,
  HStack,
  SkeletonCircle,
  Box,
  Image,
  Flex,
} from '@chakra-ui/react';
import { greyMinusSrc, questionMarkSrc } from '@/assets';
import { PlusIcon } from '@/components/icons';

export type AssetProps = FlexProps & {
  title?: string;
  mainImgSrc?: string;
  secondImg?: string;
  onAdd?: () => any;
  onRemove?: () => any;
  isLoading?: boolean;
};

export const Asset = ({
  mainImgSrc = questionMarkSrc,
  secondImg,
  children,
  title,
  onAdd,
  onRemove,
  isLoading = false,
  ...props
}: AssetProps) => {
  const MainImg = (
    <SkeletonCircle h={10} w={10} isLoaded={!isLoading}>
      <Image width={10} height={10} src={mainImgSrc} />
    </SkeletonCircle>
  );

  const SecondImg = (
    <Box width={10} height={10} position="relative">
      <SkeletonCircle h={8} w={8} isLoaded={!isLoading}>
        <Image
          position="absolute"
          width={8}
          height={8}
          top={0}
          left={0}
          src={mainImgSrc}
        />
      </SkeletonCircle>
      <SkeletonCircle h={8} w={8} isLoaded={!isLoading}>
        <Image
          position="absolute"
          width={8}
          height={8}
          bottom={0}
          right={0}
          src={secondImg}
        />
      </SkeletonCircle>
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
        <Box as="h3" fontSize="lg" ml={4} fontWeight={700} color="#F6FCFD">
          {title}
        </Box>
      </Flex>
      {children}
      <HStack>
        <SkeletonCircle h={10} w={10} isLoaded={!isLoading}>
          {onRemove && (
            <IconButton
              icon={<Image src={greyMinusSrc} />}
              aria-label="Left icon"
              isRound
              variant="outline"
              onClick={onRemove}
            />
          )}
        </SkeletonCircle>

        <SkeletonCircle h={10} w={10} isLoaded={!isLoading}>
          {onAdd && (
            <IconButton
              icon={<PlusIcon />}
              aria-label="Right icon"
              isRound
              variant="outline"
              onClick={onAdd}
            />
          )}
        </SkeletonCircle>
      </HStack>
    </Flex>
  );
};
