import { Box, HStack, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { Liquidity, toBigNumber } from '@psychedelic/sonic-js';
import { FaMinus } from '@react-icons/all-files/fa/FaMinus';
import { FaPlus } from '@react-icons/all-files/fa/FaPlus';
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

import { RemoveLiquidityModal } from './remove-liquidity-modal';

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
  const { isBannerOpened } = useLiquidityViewStore();

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
            const lpBalance = userLPBalances[token0.id]?.[token1.id];
            const pair = allPairs[token0.id]?.[token1.id];

            const balances = Liquidity.getTokenBalances({
              decimals0: token0.decimals,
              decimals1: token1.decimals,
              reserve0: pair.reserve0,
              reserve1: pair.reserve1,
              totalSupply: pair.totalSupply,
              lpBalance,
            });

            balance0 = balances.balance0.toString();
            balance1 = balances.balance1.toString();
          }

          const userShares = toBigNumber(userLPBalances[tokenId0][tokenId1])
            .applyDecimals(Liquidity.PAIR_DECIMALS)
            .toString();

          const totalShares = toBigNumber(
            allPairs?.[tokenId0]?.[tokenId1]?.totalSupply
          )
            .applyDecimals(Liquidity.PAIR_DECIMALS)
            .toString();

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

  const _getUserLPValue = useCallback(
    (
      token0: AppTokenMetadata,
      token1: AppTokenMetadata,
      totalShares?: string,
      userShares?: string
    ) => {
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

      <RemoveLiquidityModal />

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
          {pairedUserLPTokens.map((userLPToken, index) => {
            const {
              token0,
              token1,
              userShares,
              totalShares,
              balance0,
              balance1,
            } = userLPToken;

            if (!token0.id || !token1.id) {
              return null;
            }

            const userLPValue = _getUserLPValue(
              token0,
              token1,
              totalShares,
              userShares
            );

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
                    value={userLPValue}
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
                    onClick={() => moveToAddLiquidityView(token0.id, token1.id)}
                  />
                </HStack>
              </Asset>
            );
          })}
        </Stack>
      )}
    </>
  );
};
