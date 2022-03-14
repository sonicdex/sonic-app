import {
  Box,
  Button,
  Divider,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Liquidity, Pair } from '@psychedelic/sonic-js';
import { FaInfoCircle } from '@react-icons/all-files/fa/FaInfoCircle';
import { useMemo } from 'react';

import { DisplayValue, TokenImageBlock } from '@/components';
import { LPBreakdownPopover } from '@/components/core/lp-breakdown-popover';
import { UserPairMetrics } from '@/hooks';
import { AppTokenMetadata } from '@/models';

export interface PairedUserLPTokenProps {
  pairId: string;
  token0: AppTokenMetadata;
  token1: AppTokenMetadata;
  balance0: string;
  balance1: string;
  userShares: string;
  totalShares?: string;
  allPairs?: Pair.List;
  pairMetrics?: UserPairMetrics[keyof UserPairMetrics];
  handleRemove: (token0: AppTokenMetadata, token1: AppTokenMetadata) => void;
  handleAdd: (token0?: string, token1?: string) => void;
  isMetricsLoading?: boolean;
  isLPBalanceLoading?: boolean;
}

export const PairedUserLPToken: React.FC<PairedUserLPTokenProps> = ({
  token0,
  token1,
  totalShares,
  userShares,
  allPairs,
  balance0,
  balance1,
  pairMetrics,
  handleAdd,
  handleRemove,
  isMetricsLoading,
  isLPBalanceLoading,
}) => {
  const successColor = useColorModeValue('green.500', 'green.400');
  const bg = useColorModeValue('gray.50', 'custom.2');
  const shadow = useColorModeValue('base', 'none');
  const headerColor = useColorModeValue('gray.600', 'gray.400');

  const userLPValue = useMemo(() => {
    const pair = allPairs?.[token0.id]?.[token1.id];

    if (pair && token0.price && token1.price && totalShares && userShares) {
      return Liquidity.getUserPositionValue({
        price0: token0.price,
        price1: token1.price,
        reserve0: pair.reserve0,
        reserve1: pair.reserve1,
        decimals0: token0.decimals,
        decimals1: token1.decimals,
        totalShares,
        userShares,
      }).toString();
    }

    return '0';
  }, [allPairs, token0, token1, totalShares, userShares]);

  return (
    <Flex direction="column" borderRadius="xl" bg={bg} shadow={shadow}>
      <Flex
        position="relative"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        px={5}
        py={4}
        gridGap={1.5}
      >
        <TokenImageBlock src={token0.logo} size={7} />
        <TokenImageBlock src={token1.logo} size={7} />
        <Text flex={1} fontWeight="bold" fontSize={18}>
          {token0.symbol}/{token1.symbol}
        </Text>
        <Button
          variant="outline"
          borderColor="dark-blue.500"
          w={100}
          onClick={() => handleAdd(token0.id, token1.id)}
        >
          Add
        </Button>
        <Button
          variant="ghost"
          w={100}
          onClick={() => handleRemove(token0, token1)}
        >
          Remove
        </Button>
      </Flex>

      <Divider />

      <Flex direction="row" px={6} py={4}>
        <LPBreakdownPopover
          sources={[
            {
              src: token0.logo,
              symbol: token0.symbol,
              decimals: token0.decimals,
              balance: balance0,
            },
            {
              src: token1.logo,
              symbol: token1.symbol,
              decimals: token1.decimals,
              balance: balance1,
            },
          ]}
        >
          <Box flex={1}>
            <Text color={headerColor}>LP Tokens</Text>
            <DisplayValue
              value={userShares}
              isUpdating={isLPBalanceLoading}
              disableTooltip
              fontWeight="bold"
            />
          </Box>
        </LPBreakdownPopover>

        <Box flex={1}>
          <Text color={headerColor}>USD Value</Text>
          <DisplayValue
            isUpdating={isLPBalanceLoading}
            prefix="$"
            value={userLPValue}
            fontWeight="bold"
            disableTooltip
          />
        </Box>

        <Popover trigger="hover">
          <PopoverTrigger>
            <Box
              flex={1}
              backgroundColor="#8888882f"
              mx={-3}
              my={-1}
              px={3}
              py={1}
              borderRadius="xl"
            >
              <Text
                color={headerColor}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                Fees Earned <FaInfoCircle />
              </Text>
              <DisplayValue
                color={successColor}
                isUpdating={isMetricsLoading}
                prefix="$"
                value={pairMetrics?.fees ?? 0}
                fontWeight="bold"
                disableTooltip
              />
            </Box>
          </PopoverTrigger>

          <PopoverContent>
            <PopoverArrow />
            <PopoverHeader>Estimated Fees Earned</PopoverHeader>
            <PopoverBody>
              This amount is estimation calculated through snapshots of your
              positions and can variate with price floating. It also represents
              your fees earned for all liquidity positions you have or already
              had on Sonic.
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
    </Flex>
  );
};
