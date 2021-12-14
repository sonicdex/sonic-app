import {
  Alert,
  AlertIcon,
  AlertTitle,
  HStack,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';

import {
  Asset,
  AssetImageBlock,
  AssetTitleBlock,
  Header,
  PlugButton,
} from '@/components';
import { DefaultTokensImage } from '@/constants';
import { usePlugStore } from '@/store';

export const Activity = () => {
  const { isConnected } = usePlugStore();

  return (
    <>
      <Header title="Your Activity" />

      {!isConnected ? (
        <>
          <Alert status="warning" mb={6}>
            <AlertIcon />
            <AlertTitle>You are not connected to the wallet</AlertTitle>
          </Alert>

          <PlugButton />
        </>
      ) : (
        <Stack spacing={4}>
          <Stack>
            <Text>October 18th, 2021</Text>
            <Asset
              type="swap"
              imageSources={[
                DefaultTokensImage['XTC'],
                DefaultTokensImage['WICP'],
              ]}
            >
              <HStack spacing={4}>
                <AssetImageBlock />
                <AssetTitleBlock title="Swap XTC to WICP" subtitle="10:17 AM" />
              </HStack>
              <Stack textAlign="end">
                <Heading as="h6" size="sm">
                  -182.27 XTC
                </Heading>
                <Text color="gray.400">-$182.27</Text>
              </Stack>
            </Asset>

            <Asset
              type="lp"
              imageSources={[
                DefaultTokensImage['XTC'],
                DefaultTokensImage['WICP'],
              ]}
            >
              <HStack spacing={4}>
                <AssetImageBlock />
                <AssetTitleBlock title="Remove LP" subtitle="3:10 AM" />
              </HStack>
              <Stack textAlign="end">
                <Heading as="h6" size="sm">
                  182.27 XTC + 40.21 WICP
                </Heading>
                <Text color="gray.400">$18,372.27</Text>
              </Stack>
            </Asset>
          </Stack>

          <Stack>
            <Text>October 17th, 2021</Text>
            <Asset
              type="lp"
              imageSources={[
                DefaultTokensImage['XTC'],
                DefaultTokensImage['WICP'],
              ]}
            >
              <HStack spacing={4}>
                <AssetImageBlock />
                <AssetTitleBlock title="Add LP" subtitle="10:17 AM" />
              </HStack>
              <Stack textAlign="end">
                <Heading as="h6" size="sm">
                  182.27 XTC + 40.21 WICP
                </Heading>
                <Text color="gray.400">$18,372.27</Text>
              </Stack>
            </Asset>
          </Stack>
        </Stack>
      )}
    </>
  );
};
