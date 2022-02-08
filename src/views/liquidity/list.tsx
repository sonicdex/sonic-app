import { Box, HStack, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { FaMinus } from '@react-icons/all-files/fa/FaMinus';
import { FaPlus } from '@react-icons/all-files/fa/FaPlus';
import BigNumber from 'bignumber.js';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';

import {
  Asset,
  AssetIconButton,
  AssetImageBlock,
  AssetTitleBlock,
  DisplayValue,
  Header,
  InformationBox,
  PlugNotConnected,
} from '@/components';
import { LPBreakdownPopover } from '@/components/core/lp-breakdown-popover';
import { AppTokenMetadata } from '@/models';
import {
  FeatureState,
  liquidityViewActions,
  modalsSliceActions,
  useAppDispatch,
  useLiquidityViewStore,
  usePlugStore,
  useSwapCanisterStore,
} from '@/store';
import { getCurrency, getCurrencyString } from '@/utils/format';

const INFORMATION_TITLE = 'Liquidity Provider Rewards';
const INFORMATION_DESCRIPTION =
  'Liquidity providers earn a 0.3% fee on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity. If you want to learn ';
const INFORMATION_LINK =
  'https://docs.sonic.ooo/product/adding-liquidity/claiming-your-rewards';

const InformationDescription = () => {
  const color = useColorModeValue('gray.600', 'custom.1');

  return (
    <Text color={color}>
      {INFORMATION_DESCRIPTION}
      <Box
        as="a"
        color={color}
        href={INFORMATION_LINK}
        textDecoration="underline"
        _visited={{
          color: color,
        }}
      >
        review our documentation
      </Box>
      .
    </Text>
  );
};

type PairedUserLPToken = {
  token0: AppTokenMetadata;
  token1: AppTokenMetadata;
  balance0: string;
  balance1: string;
  userShares: string;
  totalShares?: string;
};

export const LiquidityListView = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isConnected } = usePlugStore();
  const {
    allPairs,
    allPairsState,
    userLPBalances,
    userLPBalancesState,
    supportedTokenList,
    supportedTokenListState,
  } = useSwapCanisterStore();
  const { isBannerOpened, removeAmountPercentage } = useLiquidityViewStore();

  const moveToAddLiquidityView = (token0?: string, token1?: string) => {
    const query =
      token0 || token1
        ? `?${token0 ? `token0=${token0}` : ''}${
            token1 ? `&token1=${token1}` : ''
          }`
        : '';

    navigate(`/liquidity/add${query}`);
  };

  const handleInformationClose = () => {
    dispatch(liquidityViewActions.setIsBannerOpened(false));
  };

  const handleOpenRemoveLiquidityModal = (
    token0: AppTokenMetadata,
    token1: AppTokenMetadata
  ) => {
    dispatch(liquidityViewActions.setToken({ data: 'token0', token: token0 }));
    dispatch(liquidityViewActions.setToken({ data: 'token1', token: token1 }));
    dispatch(modalsSliceActions.openRemoveLiquidityModal());
  };

  const isLoading = useMemo(() => {
    return (
      allPairsState === FeatureState.Loading ||
      supportedTokenListState === FeatureState.Loading ||
      userLPBalancesState === FeatureState.Loading
    );
  }, [allPairsState, supportedTokenListState, userLPBalancesState]);

  const isUserLPBalancesUpdating = useMemo(() => {
    return userLPBalancesState === FeatureState.Updating;
  }, [userLPBalancesState]);

  const isUpdating = useMemo(() => {
    return (
      allPairsState === FeatureState.Updating ||
      supportedTokenListState === FeatureState.Updating ||
      isUserLPBalancesUpdating
    );
  }, [allPairsState, supportedTokenListState, isUserLPBalancesUpdating]);

  const pairedUserLPTokens = useMemo(() => {
    if (userLPBalances && supportedTokenList && allPairs) {
      const lpBalancesPairIDs = Object.keys(userLPBalances);
      const existentPairs = new Set();

      return lpBalancesPairIDs.reduce((acc, tokenId0) => {
        const pairedList: PairedUserLPToken[] = [];

        for (const tokenId1 in userLPBalances[tokenId0]) {
          if (existentPairs.has(`${tokenId1}:${tokenId0}`)) continue;
          existentPairs.add(`${tokenId0}:${tokenId1}`);

          const token0 = supportedTokenList.find(
            (token) => token.id === tokenId0
          );
          const token1 = supportedTokenList.find(
            (token) => token.id === tokenId1
          );

          let balance0;
          let balance1;

          if (userLPBalances && allPairs && token0 && token1) {
            const tokenBalance = userLPBalances[token0.id]?.[token1.id];

            const pair = allPairs[token0.id]?.[token1.id];
            if (pair?.reserve0 && pair?.reserve1 && tokenBalance) {
              const normalizedReserve0 = getCurrency(
                pair.reserve0.toString(),
                token0.decimals
              );
              const normalizedReserve1 = getCurrency(
                pair.reserve1.toString(),
                token1.decimals
              );

              const normalizedTotalSupply = getCurrency(
                pair.totalSupply.toString(),
                Math.round((token0.decimals + token1.decimals) / 2)
              );

              const normalizedTokenBalance = getCurrency(
                tokenBalance.toString(),
                Math.round((token0.decimals + token1.decimals) / 2)
              );

              balance0 = new BigNumber(normalizedTokenBalance)
                .dividedBy(normalizedTotalSupply)
                .multipliedBy(normalizedReserve0)
                .multipliedBy(removeAmountPercentage / 100)
                .toString();

              balance1 = new BigNumber(normalizedTokenBalance)
                .dividedBy(normalizedTotalSupply)
                .multipliedBy(normalizedReserve1)
                .multipliedBy(removeAmountPercentage / 100)
                .toString();
            }
          }

          const userShares = getCurrencyString(
            userLPBalances[tokenId0][tokenId1],
            Math.round(((token0?.decimals ?? 0) + (token1?.decimals ?? 0)) / 2)
          );

          const totalShares = getCurrencyString(
            allPairs?.[tokenId0]?.[tokenId1]?.totalSupply,
            Math.round(((token0?.decimals ?? 0) + (token1?.decimals ?? 0)) / 2)
          );

          pairedList.push({
            token0,
            token1,
            balance0,
            balance1,
            userShares,
            totalShares,
          } as PairedUserLPToken);
        }

        return [...acc, ...pairedList];
      }, [] as PairedUserLPToken[]);
    }
  }, [userLPBalances, supportedTokenList, allPairs]);

  const getUserLPValue = useCallback(
    (
      token0: AppTokenMetadata,
      token1: AppTokenMetadata,
      totalShares?: string,
      userShares?: string
    ) => {
      // How many LP tokens I have divided by total LP tokens in the pool = percentage of a pool
      // Multiply poap by amount of tokens of each reserves
      // Multiply by a price
      const pair = allPairs?.[token0.id]?.[token1.id];

      if (pair && token0.price && token1.price && totalShares && userShares) {
        const token0Price = new BigNumber(token0.price).multipliedBy(
          getCurrency(pair.reserve0, token0.decimals)
        );
        const token1Price = new BigNumber(token1.price).multipliedBy(
          getCurrency(pair.reserve1, token1.decimals)
        );
        const priceByLP = token0Price.plus(token1Price).dividedBy(totalShares);

        const userLPValue = new BigNumber(userShares).multipliedBy(priceByLP);

        return userLPValue.toString();
      }

      return '0';
    },
    [allPairs]
  );

  const headerColor = useColorModeValue('gray.600', 'gray.400');
  const successColor = useColorModeValue('green.500', 'green.400');

  return (
    <>
      <Header
        title="Your Liquidity Positions"
        buttonText="Create Position"
        onButtonClick={() => moveToAddLiquidityView()}
        isUpdating={isUpdating}
      >
        {isBannerOpened && (
          <InformationBox
            onClose={handleInformationClose}
            title={INFORMATION_TITLE}
            mb={9}
          >
            <InformationDescription />
          </InformationBox>
        )}
      </Header>

      {!isConnected ? (
        <PlugNotConnected message="Your liquidity positions will appear here." />
      ) : isLoading ? (
        <Stack spacing={4}>
          <Asset isLoading>
            <AssetImageBlock />
            <HStack>
              <AssetIconButton aria-label="Deposit" icon={<FaPlus />} />
              <AssetIconButton aria-label="Withdraw" icon={<FaMinus />} />
            </HStack>
          </Asset>

          <Asset isLoading>
            <AssetImageBlock />
            <HStack>
              <AssetIconButton aria-label="Deposit" icon={<FaPlus />} />
              <AssetIconButton aria-label="Withdraw" icon={<FaMinus />} />
            </HStack>
          </Asset>

          <Asset isLoading>
            <AssetImageBlock />
            <HStack>
              <AssetIconButton aria-label="Deposit" icon={<FaPlus />} />
              <AssetIconButton aria-label="Withdraw" icon={<FaMinus />} />
            </HStack>
          </Asset>
        </Stack>
      ) : !pairedUserLPTokens?.length ? (
        <Text textAlign="center" color={headerColor}>
          You have no liquidity positions
        </Text>
      ) : (
        <Stack
          css={{
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
          spacing={4}
          pb={40}
          overflow="auto"
        >
          {pairedUserLPTokens.map(
            (
              { token0, token1, userShares, totalShares, balance0, balance1 },
              index
            ) => {
              if (!token0.id || !token1.id) {
                return null;
              }

              return (
                <Asset
                  key={index}
                  type="lp"
                  imageSources={[token0.logo, token1.logo]}
                >
                  <HStack spacing={4}>
                    <AssetImageBlock />
                    <AssetTitleBlock
                      title={`${token0.symbol}/${token1.symbol}`}
                    />
                  </HStack>

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
                    <Box>
                      <Text fontWeight="bold" color={headerColor}>
                        LP Tokens
                      </Text>
                      <DisplayValue
                        value={userShares}
                        isUpdating={isUserLPBalancesUpdating}
                        disableTooltip
                      />
                    </Box>
                  </LPBreakdownPopover>

                  <Box>
                    <Text fontWeight="bold" color={headerColor}>
                      LP Value
                    </Text>
                    <DisplayValue
                      color={successColor}
                      isUpdating={isUserLPBalancesUpdating}
                      prefix="~$"
                      value={getUserLPValue(
                        token0,
                        token1,
                        totalShares,
                        userShares
                      )}
                    />
                  </Box>

                  <HStack>
                    <AssetIconButton
                      aria-label="Remove Liquidity"
                      icon={<FaMinus />}
                      onClick={() =>
                        handleOpenRemoveLiquidityModal(token0, token1)
                      }
                    />
                    <AssetIconButton
                      aria-label="Add Liquidity"
                      colorScheme="dark-blue"
                      icon={<FaPlus />}
                      onClick={() =>
                        moveToAddLiquidityView(token0.id, token1.id)
                      }
                    />
                  </HStack>
                </Asset>
              );
            }
          )}
        </Stack>
      )}
    </>
  );
};
