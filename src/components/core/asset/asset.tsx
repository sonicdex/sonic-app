import {
  IconButton,
  FlexProps,
  Heading,
  Text,
  HStack,
  SkeletonCircle,
  Box,
  Image,
  Flex,
  Tooltip,
} from '@chakra-ui/react';
import { greyMinusSrc, questionMarkSrc } from '@/assets';
import { PlusIcon } from '@/components/icons';
import { SwapIDL } from '@/did';

export type AssetProps = FlexProps &
  Partial<SwapIDL.TokenInfoExt> & {
    addLabel?: string;
    removeLabel?: string;
    mainImgSrc?: string;
    secondImg?: string;
    onAdd?: () => any;
    onRemove?: () => any;
    isLoading?: boolean;
  };

export const Asset = ({
  symbol,
  name,
  addLabel = 'Add',
  removeLabel = 'Remove',
  mainImgSrc = questionMarkSrc,
  secondImg,
  children,
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
        <Box ml={4}>
          <Heading as="h3" fontSize="lg" fontWeight={700} color="#F6FCFD">
            {symbol}
          </Heading>
          <Text fontSize="sm" color="gray.400">
            {name}
          </Text>
        </Box>
      </Flex>
      {children}
      <HStack>
        <SkeletonCircle h={10} w={10} isLoaded={!isLoading}>
          {onRemove && (
            <Tooltip label={removeLabel}>
              <IconButton
                icon={<Image src={greyMinusSrc} />}
                aria-label="Left icon"
                isRound
                variant="outline"
                onClick={onRemove}
              />
            </Tooltip>
          )}
        </SkeletonCircle>

        <SkeletonCircle h={10} w={10} isLoaded={!isLoading}>
          {onAdd && (
            <Tooltip label={addLabel}>
              <IconButton
                icon={<PlusIcon />}
                aria-label="Right icon"
                isRound
                variant="outline"
                onClick={onAdd}
              />
            </Tooltip>
          )}
        </SkeletonCircle>
      </HStack>
    </Flex>
  );
};
