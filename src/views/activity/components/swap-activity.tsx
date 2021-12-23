import {
  Asset,
  AssetImageBlock,
  AssetTitleBlock,
  DisplayCurrency,
} from '@/components';
import { useActivityViewStore } from '@/store';
import { Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { FaArrowRight } from 'react-icons/fa';

export type SwapActivityProps = {
  amountIn: number;
  amountOut: number;
  fee: number;
  from: string;
  pairId: string;
  reserve0: number;
  reserve1: number;
  to: string;
  time: number;
};

export const SwapActivity = ({
  from,
  to,
  time,
  amountIn,
  amountOut,
}: SwapActivityProps) => {
  const { tokenList } = useActivityViewStore();

  if (!tokenList) return null;

  const fromToken = tokenList[from];
  const toToken = tokenList[to];

  return (
    <Asset type="swap" imageSources={[fromToken.logo, toToken.logo]}>
      <HStack spacing={4}>
        <AssetImageBlock />
        <AssetTitleBlock
          title={`Swap ${fromToken.symbol} to ${toToken.symbol}`}
          subtitle={new Date(time).toLocaleTimeString('en-US')}
        />
      </HStack>
      <Stack textAlign="end">
        <Heading as="h6" size="sm" display="flex" alignItems="center">
          <DisplayCurrency
            balance={amountIn}
            decimals={fromToken.decimals}
            suffix={' ' + fromToken.symbol}
          />
          &nbsp;
          <FaArrowRight />
          &nbsp;
          <DisplayCurrency
            balance={amountOut}
            decimals={fromToken.decimals}
            suffix={' ' + toToken.symbol}
          />
        </Heading>
        <Text color="gray.400">$0</Text>
      </Stack>
    </Asset>
  );
};
