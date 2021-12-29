import { questionMarkSrc } from '@/assets';
import { Image, SkeletonCircle } from '@chakra-ui/react';
import React from 'react';

export type TokenImageBlockProps = {
  isLoading?: boolean;
  src?: string;
};

export const TokenImageBlock: React.FC<TokenImageBlockProps> = ({
  isLoading,
  src = questionMarkSrc,
}) => {
  return (
    <SkeletonCircle h={10} w={10} isLoaded={!isLoading}>
      <Image width={10} height={10} src={src} borderRadius="full" />
    </SkeletonCircle>
  );
};
