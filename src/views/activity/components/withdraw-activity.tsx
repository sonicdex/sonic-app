import { Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { Principal } from '@dfinity/principal';

import {
  Asset,
  AssetImageBlock,
  AssetTitleBlock,
  DisplayValue,
} from '@/components';
import { useActivityViewStore } from '@/store';

export type WithdrawActivityProps = {
  amount: number;
  balance: number;
  fee: number;
  from: Principal;
  to: Principal;
  tokenId: string;
  totalSupply: number;
  time: number;
};

export const WithdrawActivity = ({
  amount,
  tokenId,
  time,
}: WithdrawActivityProps) => {
  const { tokenList } = useActivityViewStore();

  if (!tokenList) return null;

  const token = tokenList[tokenId];

  return (
    <Asset type="token" imageSources={[token.logo]}>
      <HStack spacing={4}>
        <AssetImageBlock />
        <AssetTitleBlock
          title={`Withdraw ${token.symbol}`}
          subtitle={new Date(time).toLocaleTimeString('en-US')}
        />
      </HStack>
      <Stack textAlign="end">
        <Heading as="h6" size="sm" display="flex" alignItems="center">
          <DisplayValue
            value={amount}
            decimals={token.decimals}
            suffix={' ' + token.symbol}
          />
        </Heading>
        <Text color="gray.400">$0</Text>
      </Stack>
    </Asset>
  );
};
