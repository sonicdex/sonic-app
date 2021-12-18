import { questionMarkSrc } from '@/assets';
import { Box, Image, SkeletonCircle, Text } from '@chakra-ui/react';
import React from 'react';

export type SwapImageBlockProps = {
  isLoading?: boolean;
  imageSources?: string[];
};

export const SwapImageBlock: React.FC<SwapImageBlockProps> = ({
  isLoading,
  imageSources = [questionMarkSrc, questionMarkSrc],
}) => {
  return (
    <Box width={10} height={10} position="relative">
      <SkeletonCircle h={6} w={6} isLoaded={!isLoading}>
        <Image
          position="absolute"
          width={6}
          height={6}
          top={0}
          left={0}
          src={imageSources[0]}
        />
      </SkeletonCircle>
      <Text>&#x21AA;</Text>
      <SkeletonCircle h={6} w={6} isLoaded={!isLoading}>
        <Image
          position="absolute"
          width={6}
          height={6}
          bottom={0}
          right={0}
          src={imageSources[1]}
        />
      </SkeletonCircle>
    </Box>
  );
};
