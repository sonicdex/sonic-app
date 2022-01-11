import {
  Flex,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Stack,
  Text,
} from '@chakra-ui/react';
import { FaArrowRight } from '@react-icons/all-files/fa/FaArrowRight';
import React, { useCallback, useMemo } from 'react';

import { infoSrc } from '@/assets';
import { StackLine } from '@/components';
import { ICP_METADATA } from '@/constants';
import { TokenData } from '@/models';
import { useSwapCanisterStore } from '@/store';
import {
  calculatePriceImpact,
  getAmountOut,
  getAmountOutMin,
  getCurrencyString,
} from '@/utils/format';

export type ExchangeBoxProps = {
  from: TokenData;
  to: TokenData;
  slippage: string;
};

export const ExchangeBox: React.FC<ExchangeBoxProps> = ({
  from,
  to,
  slippage,
}) => {
  const { allPairs } = useSwapCanisterStore();

  const getPriceImpact = useCallback(
    (reserve0: bigint, reserve1: bigint) => {
      if (from.metadata?.decimals && to.metadata?.decimals) {
        return calculatePriceImpact({
          amountIn: from.value,
          decimalsIn: from.metadata.decimals,
          decimalsOut: to.metadata.decimals,
          reserve0: reserve0.toString(),
          reserve1: reserve1.toString(),
        });
      }

      return '0';
    },
    [from, to]
  );

  const { depositFee, withdrawFee } = useMemo(() => {
    if (from.metadata?.id && to.metadata?.id) {
      const depositFee = getCurrencyString(
        BigInt(2) * from.metadata.fee,
        from.metadata.decimals
      );

      const withdrawFee = getCurrencyString(
        to.metadata.fee,
        to.metadata.decimals
      );

      return { depositFee, withdrawFee };
    }

    return { depositFee: 0, withdrawFee: 0 };
  }, [from, to]);

  if (!from.metadata || !to.metadata) return null;

  const [icp, feeMessage] =
    from.metadata.id === ICP_METADATA.id
      ? [from.metadata, 'Wrap']
      : to.metadata.id === ICP_METADATA.id
      ? [to.metadata, 'Unwrap']
      : [];

  if (icp) {
    return (
      <Flex opacity={0.4} alignItems="center" px={4} fontWeight={400}>
        <Text display="flex" alignItems="center">
          {from.metadata.symbol}&nbsp;
          <FaArrowRight />
          &nbsp;{to.metadata.symbol}
        </Text>
        <Text flex={1} textAlign="right">
          {feeMessage} Fee = {getCurrencyString(icp.fee, icp.decimals)}
        </Text>
      </Flex>
    );
  }

  if (!allPairs?.[from.metadata.id]?.[to.metadata.id]) {
    return null;
  }

  const { reserve0, reserve1 } = allPairs[from.metadata.id][to.metadata.id];

  return (
    <Flex opacity={0.4} alignItems="center" px={4} fontWeight={400}>
      <Text display="flex" alignItems="center">
        {from.metadata.symbol}&nbsp;
        <FaArrowRight />
        &nbsp;{to.metadata.symbol}
      </Text>
      <Text flex={1} textAlign="right" mx={2}>
        1&nbsp;{from.metadata.symbol}&nbsp;=&nbsp;
        {getAmountOut({
          amountIn: 1,
          decimalsIn: from.metadata.decimals,
          decimalsOut: to.metadata.decimals,
          reserveIn: Number(reserve0),
          reserveOut: Number(reserve1),
        })}
        &nbsp;
        {to.metadata.symbol}
      </Text>
      <Popover trigger="hover">
        <PopoverTrigger>
          <Image
            alt="info"
            src={infoSrc}
            width={5}
            transition="opacity 200ms"
          />
        </PopoverTrigger>
        <Portal>
          <PopoverContent minWidth="400px">
            <PopoverHeader>Transaction Details</PopoverHeader>
            <PopoverArrow />
            <PopoverBody display="inline-block">
              <Stack>
                <StackLine
                  title="Minimum Received"
                  value={`${
                    to.value
                      ? getAmountOutMin(
                          to.value,
                          Number(slippage) / 100,
                          to.metadata.decimals,
                          [
                            {
                              fee: from.metadata.fee,
                              decimals: from.metadata.decimals,
                            },
                            {
                              fee: to.metadata.fee,
                              decimals: to.metadata.decimals,
                            },
                          ]
                        )
                      : 0
                  } ${to.metadata.symbol}`}
                />
                <StackLine
                  title="Price Impact"
                  value={`${getPriceImpact(reserve0, reserve1)}%`}
                />
                <StackLine title="Allowed Slippage" value={`${slippage}%`} />
                {/* TODO: add liquidity fee */}
                {/* <StackLine
                  title="Liquidity Provider Fee"
                  value={`${10} ${to.metadata.symbol}`}
                /> */}
                <StackLine
                  title="Deposit Fee"
                  value={`${depositFee} ${from.metadata.symbol}`}
                />
                <StackLine
                  title="Withdraw Fee"
                  value={`${withdrawFee} ${to.metadata.symbol}`}
                />
              </Stack>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </Flex>
  );
};
