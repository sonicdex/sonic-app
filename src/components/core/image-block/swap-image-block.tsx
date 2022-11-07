import { Box, Image, SkeletonCircle, Text } from '@chakra-ui/react';
import React from 'react';

import { questionMarkSrc } from '@/assets';

export type SwapImageBlockProps = {
  isLoading?: boolean;
  imageSources?: string[];
};

export const SwapImageBlock: React.FC<SwapImageBlockProps> = ({
  isLoading,
  imageSources = [questionMarkSrc, questionMarkSrc],
}) => {
  return (
    <Box width={10} height={10} position="relative" minW="fit-content">
      <SkeletonCircle h={6} w={6} isLoaded={!isLoading}>
        <Image
          alt="token from"
          position="absolute"
          width={6}
          height={6}
          top={0}
          left={0}
          src={imageSources[0]}
          borderRadius="full"
        />
      </SkeletonCircle>
      <Text>&#x21AA;</Text>
      <SkeletonCircle h={6} w={6} isLoaded={!isLoading}>
        <Image
          alt="token to"
          position="absolute"
          width={6}
          height={6}
          bottom={0}
          right={0}
          src={imageSources[1]}
          borderRadius="full"
        />
      </SkeletonCircle>
    </Box>
  );
};
