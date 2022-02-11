import {
  Flex,
  Icon,
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
import { FaInfoCircle } from '@react-icons/all-files/fa/FaInfoCircle';
import BigNumber from 'bignumber.js';
import React, { useMemo } from 'react';

import { DisplayValue, StackLine } from '@/components';
import { ENV } from '@/config';
import { ICP_METADATA } from '@/constants';
import { useBalances, useTokenSelectionChecker } from '@/hooks';
import { useCyclesMintingCanisterStore, useSwapViewStore } from '@/store';
import {
  formatValue,
  getAmountOutMin,
  getCurrencyString,
  getPathAmountOut,
  getXTCValueByXDRRate,
} from '@/utils/format';

import { ChainPopover } from './chain-popover';

export type ExchangeBoxProps = {
  priceImpact?: string;
};

export const ExchangeBox: React.FC<ExchangeBoxProps> = ({ priceImpact }) => {
  const { from, to, slippage, baseFromTokenPaths, keepInSonic, allPairs } =
    useSwapViewStore();

  const { sonicBalances } = useBalances();

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

  const { depositFee, withdrawFee } = useMemo(() => {
    if (from.metadata?.id && to.metadata?.id && sonicBalances) {
      const hasDeposit = sonicBalances[from.metadata.id] < Number(from.value);
      const depositFee =
        hasDeposit && Number(from.metadata.fee) > 0
          ? getCurrencyString(
              BigInt(2) * from.metadata.fee,
              from.metadata.decimals
            )
          : undefined;

      const withdrawFee =
        !keepInSonic && Number(to.metadata.fee) > 0
          ? getCurrencyString(to.metadata.fee, to.metadata.decimals)
          : undefined;

      return { depositFee, withdrawFee };
    }

    return {};
  }, [from, to, sonicBalances, keepInSonic]);

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
        ? getXTCValueByXDRRate({
            amount: formatValue(ICP_METADATA.fee, ICP_METADATA.decimals),
            conversionRate: ICPXDRconversionRate,
          }).minus(formatValue(xtcMetadata.fee, xtcMetadata.decimals))
        : new BigNumber(0);

    const xtcFees = icpMetadata
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

    const fee = isToTokenIsXTC ? xtcFees : wicpFee;
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
        {getPathAmountOut(
          { metadata: from.metadata, paths: baseFromTokenPaths, value: '1' },
          to
        )}
        &nbsp;
        {to.metadata.symbol}
      </Text>
      <Popover trigger="hover">
        <PopoverTrigger>
          <Flex>
            <Icon as={FaInfoCircle} width={5} transition="opacity 200ms" />
          </Flex>
        </PopoverTrigger>
        <Portal>
          <PopoverContent minWidth="400px">
            <PopoverHeader>Transaction Details</PopoverHeader>
            <PopoverArrow />
            <PopoverBody display="inline-block">
              <Stack>
                <StackLine
                  title="Minimum Received"
                  value={`${getAmountOutMin(
                    from,
                    to,
                    slippage,
                    allPairs,
                    Boolean(depositFee),
                    keepInSonic
                  )} ${to.metadata.symbol}`}
                />
                <StackLine
                  title="Price Impact"
                  value={
                    <DisplayValue as="span" value={priceImpact} suffix="%" />
                  }
                />
                <StackLine title="Allowed Slippage" value={`${slippage}%`} />
                {depositFee && (
                  <StackLine
                    title="Deposit Fee"
                    value={`${depositFee} ${from.metadata.symbol}`}
                  />
                )}
                {withdrawFee && (
                  <StackLine
                    title="Withdraw Fee"
                    value={`${withdrawFee} ${to.metadata.symbol}`}
                  />
                )}
              </Stack>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </Flex>
  );
};
