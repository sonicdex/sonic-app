import { Heading, HStack, Stack } from '@chakra-ui/react';
import { FaArrowRight } from '@react-icons/all-files/fa/FaArrowRight';

import {
  Asset,
  AssetImageBlock,
  AssetTitleBlock,
  DisplayValue,
} from '@/components';
import { useActivityViewStore } from '@/store';

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

  if (!fromToken || !toToken) return null;

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
          <DisplayValue
            value={amountIn}
            decimals={fromToken.decimals}
            suffix={' ' + fromToken.symbol}
            shouldDivideByDecimals
          />
          &nbsp;
          <FaArrowRight />
          &nbsp;
          <DisplayValue
            value={amountOut}
            decimals={toToken.decimals}
            suffix={' ' + toToken.symbol}
            shouldDivideByDecimals
          />
        </Heading>
      </Stack>
    </Asset>
  );
};
