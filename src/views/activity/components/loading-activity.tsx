import { Heading, HStack, Skeleton, Stack } from '@chakra-ui/react';

import { Asset, AssetImageBlock, AssetTitleBlock } from '@/components';

export const LoadingActivity = () => {
  return (
    <Asset type="token" isLoading mb={2}>
      <HStack spacing={4}>
        <AssetImageBlock />
        <AssetTitleBlock title={`Loading Title`} subtitle={'Loading'} />
      </HStack>
      <Stack textAlign="end" alignSelf="flex-start">
        <Skeleton>
          <Heading as="h6" size="sm" display="flex" alignItems="center" mb={2}>
            Loading
          </Heading>
        </Skeleton>
      </Stack>
    </Asset>
  );
};
