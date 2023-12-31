import {
  Box, Button, Divider, Flex, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Text, useColorModeValue,
} from '@chakra-ui/react';
import { Liquidity, Pair } from '@sonicdex/sonic-js';
import { FaInfoCircle } from '@react-icons/all-files/fa/FaInfoCircle';
import { useMemo } from 'react';

import { DisplayValue, TokenImageBlock } from '@/components';
import { LPBreakdownPopover } from '@/components/core/lp-breakdown-popover';
import { UserLPMetrics } from '@/hooks'; //getuserLprewards
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
  pairMetrics?: UserLPMetrics[keyof UserLPMetrics];
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
    const pair = allPairs?.[token0?.id]?.[token1?.id];


    //  console.log(pair , token0, token1);

    if (pair && token0.price && token1.price && totalShares && userShares) {
      return Liquidity.getUserPositionValue({
        price0: token0.price, price1: token1.price,
        reserve0: pair.reserve0, reserve1: pair.reserve1,
        decimals0: token0.decimals, decimals1: token1.decimals,
        totalShares, userShares,
      }).toString();
    }
    return '0';
  }, [allPairs, token0, token1, totalShares, userShares]);

  //getuserLprewards
  // const rewardData = getuserLprewards(token0.id, token1.id);
  if (token0 && token1) {
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
          <TokenImageBlock src={token0?.logo} size={7} />
          <TokenImageBlock src={token1?.logo} size={7} />
          <Text flex={1} fontWeight="bold" fontSize="1.125rem">
            {token0.symbol}/{token1.symbol}
          </Text>
          <Button
            variant="outline"
            borderColor="dark-blue.500"
            onClick={() => handleAdd(token0.id, token1.id)}
            fontWeight="normal"
            width="4.5rem"
          >
            Add
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleRemove(token0, token1)}
            fontWeight="normal"
          >
            Remove
          </Button>
        </Flex>

        <Divider />

        <Flex direction="row" px={6} py={4}>
          <Box flex={1}>
            <Text color={headerColor}>LP Tokens</Text>
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
              <DisplayValue
                value={userShares}
                isUpdating={isLPBalanceLoading}
                fontWeight="bold"
                disableTooltip
                width="fit-content"
              />
            </LPBreakdownPopover>
          </Box>

          <Box flex={1}>
            <Text color={headerColor}>USD Value</Text>
            <DisplayValue
              isUpdating={isLPBalanceLoading}
              prefix="$"
              value={userLPValue}
              fontWeight="bold"
              decimals={8}
              width="fit-content"
            />
          </Box>

          <Box
            flex={1}
            backgroundColor="#8888882f"
            mx={-3}
            my={-1}
            px={3}
            py={1}
            borderRadius="xl"
          >

            <Popover trigger="hover">
              <PopoverTrigger>
                <Flex>
                  <Text color={headerColor} display="flex" justifyContent="space-between" alignItems="center">Fees Earned &nbsp; </Text>
                  <Flex marginTop={1}><FaInfoCircle /></Flex>
                </Flex>
              </PopoverTrigger>

              <PopoverContent color={useColorModeValue('black', 'white')}>
                <PopoverArrow />
                <PopoverBody>
                  The earned fee values for your LP (Liquidity Pool) will reset to zero upon a full or partial withdrawal of LP.


                </PopoverBody>
              </PopoverContent>
            </Popover>
            <>
              {pairMetrics?.token0 === token0.id && (
                <Flex>
                  <Flex>
                    <DisplayValue color={successColor} value={Number(pairMetrics?.token0Fee) / 10 ** token0.decimals} fontWeight="bold" width="fit-content" />
                    &nbsp; <Text>{token0.symbol}</Text>
                  </Flex>
                </Flex>
              )}

              {pairMetrics?.token0 === token1.id && (
                <Flex>
                  <Flex>
                    <DisplayValue color={successColor} value={Number(pairMetrics?.token0Fee) / 10 ** token1.decimals} fontWeight="bold" width="fit-content" />
                    &nbsp; <Text>{token1.symbol}</Text>
                  </Flex>
                </Flex>
              )}

              {pairMetrics?.token1 === token1.id && (
                <Flex marginTop={2}>
                  <Flex>
                    <DisplayValue color={successColor} value={Number(pairMetrics?.token1Fee) / 10 ** token1.decimals} fontWeight="bold" width="fit-content" />
                    &nbsp; <Text>{token1.symbol}</Text>
                  </Flex>
                </Flex>
              )}

              {pairMetrics?.token1 === token0.id && (
                <Flex marginTop={2}>
                  <Flex>
                    <DisplayValue color={successColor} value={Number(pairMetrics?.token1Fee) / 10 ** token0.decimals} fontWeight="bold" width="fit-content" />
                    &nbsp; <Text>{token0.symbol}</Text>
                  </Flex>
                </Flex>
              )}
            </>
          </Box>
        </Flex>
      </Flex>
    );
  } else {
    return (<></>)
  }
};
