import { Image, LayoutProps, SkeletonCircle } from '@chakra-ui/react';
import React from 'react';

import { questionMarkSrc } from '@/assets';

export type TokenImageBlockProps = {
  isLoading?: boolean;
  src?: string | number;
  size?: LayoutProps['width'];
};

export const TokenImageBlock: React.FC<TokenImageBlockProps> = ({
  isLoading,
  src = questionMarkSrc,
  size = 10,
}) => {
  return (
    <SkeletonCircle h={size} w={size} isLoaded={!isLoading} minW="fit-content">
      <Image
        width={size}
        height={size}
        src={src}
        borderRadius="full"
        alt="token"
      />
    </SkeletonCircle>
  );
};
