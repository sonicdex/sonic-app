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
import BigNumber from 'bignumber.js';
import React, { useMemo } from 'react';

import { infoSrc } from '@/assets';
import { DisplayValue, StackLine } from '@/components';
import { ENV } from '@/config';
import { ICP_METADATA } from '@/constants';
import { useTokenSelectionChecker } from '@/hooks';
import { useCyclesMintingCanisterStore, useSwapViewStore } from '@/store';
import {
  calculatePriceImpact,
  formatAmount,
  getAmountOutMin,
  getCurrencyString,
  getSwapAmountOut,
  getXTCValueFromICP,
} from '@/utils/format';

import { ChainPopover } from '.';

export const ExchangeBox: React.FC = () => {
  const { from, to, slippage, baseTokenPaths, keepInSonic } =
    useSwapViewStore();

  const { ICPXDRconversionRate } = useCyclesMintingCanisterStore();

  const {
    isFirstIsSelected: isFromTokenIsICP,
    isSecondIsSelected: isToTokenIsICP,
  } = useTokenSelectionChecker({
    id0: from.metadata?.id,
    id1: to.metadata?.id,
  });

  const {
    isFirstIsSelected: isFromTokenIsWICP,
    isSecondIsSelected: isToTokenIsWICP,
  } = useTokenSelectionChecker({
    id0: from.metadata?.id,
    id1: to.metadata?.id,
    targetId: ENV.canistersPrincipalIDs.WICP,
  });

  const {
    isFirstIsSelected: isFromTokenIsXTC,
    isSecondIsSelected: isToTokenIsXTC,
  } = useTokenSelectionChecker({
    id0: from.metadata?.id,
    id1: to.metadata?.id,
    targetId: ENV.canistersPrincipalIDs.XTC,
  });

  const priceImpact = useMemo(() => {
    if (from.metadata?.price && to.metadata?.price) {
      return calculatePriceImpact({
        amountIn: from.value,
        amountOut: to.value,
        priceIn: from.metadata.price,
        priceOut: to.metadata.price,
      });
    }

    return '';
  }, [from, to]);

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

  const { icpMetadata, operation, fee, feeSymbol } = useMemo(() => {
    const icpMetadata = isFromTokenIsICP
      ? from.metadata
      : isToTokenIsICP
      ? to.metadata
      : undefined;

    const xtcMetadata = isToTokenIsXTC && to.metadata;

    const operation = isFromTokenIsWICP
      ? 'Unwrap'
      : isToTokenIsWICP
      ? 'Wrap'
      : isFromTokenIsXTC
      ? 'Swap'
      : isToTokenIsXTC
      ? 'Mint XTC'
      : undefined;

    const icpFeeInXTC =
      xtcMetadata && ICPXDRconversionRate
        ? getXTCValueFromICP({
            amount: formatAmount(ICP_METADATA.fee, ICP_METADATA.decimals),
            conversionRate: ICPXDRconversionRate,
            fee: xtcMetadata.fee,
            decimals: xtcMetadata.decimals,
          })
        : new BigNumber(0);

    const xtcFee = icpMetadata
      ? new BigNumber(
          getCurrencyString(
            (to.metadata?.fee ?? BigInt(0)) *
              (keepInSonic ? BigInt(3) : BigInt(1)),
            to.metadata?.decimals
          )
        )
          .plus(icpFeeInXTC.multipliedBy(2))
          .toString()
      : '0';

    const wicpFee = icpMetadata
      ? getCurrencyString(icpMetadata.fee, icpMetadata.decimals)
      : '0';

    const fee = isToTokenIsXTC ? xtcFee : wicpFee;
    const feeSymbol = isToTokenIsXTC ? 'XTC' : 'ICP';

    return { icpMetadata, operation, fee, feeSymbol };
  }, [
    isFromTokenIsICP,
    from.metadata,
    isToTokenIsICP,
    to.metadata,
    isToTokenIsXTC,
    isFromTokenIsWICP,
    isToTokenIsWICP,
    isFromTokenIsXTC,
    ICPXDRconversionRate,
    keepInSonic,
  ]);

  if (!from.metadata || !to.metadata) return null;

  if (icpMetadata) {
    return (
      <Flex opacity={0.4} alignItems="center" px={4} fontWeight={400}>
        <Text display="flex" alignItems="center">
          {from.metadata.symbol}&nbsp;
          <FaArrowRight />
          &nbsp;{to.metadata.symbol}
        </Text>
        <Text flex={1} textAlign="right">
          {operation} Fee = <DisplayValue as="span" value={fee} /> {feeSymbol}
        </Text>
      </Flex>
    );
  }

  return (
    <Flex alignItems="center" px={4} fontWeight={400}>
      <ChainPopover from={from} to={to} />
      <Text flex={1} textAlign="right" mx={2}>
        1&nbsp;{from.metadata.symbol}&nbsp;=&nbsp;
        {getSwapAmountOut(
          { metadata: from.metadata, paths: baseTokenPaths, value: '1' },
          to
        )}
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
                  value={
                    <DisplayValue as="span" value={priceImpact} suffix="%" />
                  }
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
