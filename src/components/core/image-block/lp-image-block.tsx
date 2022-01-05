import { Box, Image, SkeletonCircle } from '@chakra-ui/react';
import React from 'react';

import { questionMarkSrc } from '@/assets';

export type LPImageBlockProps = {
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  imageSources?: (string | undefined)[];
};

export const LPImageBlock: React.FC<LPImageBlockProps> = ({
  size = 'md',
  isLoading,
  imageSources = [questionMarkSrc, questionMarkSrc],
}) => {
  const boxSize = {
    lg: 10,
    md: 9,
    sm: 8,
  };

  const skeletonSize = {
    lg: 7,
    md: 6,
    sm: 5,
  };

  return (
    <Box width={boxSize[size]} height={boxSize[size]} position="relative">
      <SkeletonCircle
        h={skeletonSize[size]}
        w={skeletonSize[size]}
        isLoaded={!isLoading}
      >
        <Image
          alt="token0"
          position="absolute"
          width={skeletonSize[size]}
          height={skeletonSize[size]}
          top={0}
          left={0}
          src={imageSources[0]}
          borderRadius="full"
        />
      </SkeletonCircle>
      <SkeletonCircle
        h={skeletonSize[size]}
        w={skeletonSize[size]}
        isLoaded={!isLoading}
      >
        <Image
          alt="token1"
          position="absolute"
          width={skeletonSize[size]}
          height={skeletonSize[size]}
          bottom={0}
          right={0}
          src={imageSources[1]}
          borderRadius="full"
        />
      </SkeletonCircle>
    </Box>
  );
};
