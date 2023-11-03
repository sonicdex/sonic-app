import { Box, Stack, Text, useColorModeValue, Flex, Button } from '@chakra-ui/react';
import { Liquidity, toBigNumber } from '@sonicdex/sonic-js';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { Asset, Header, InformationBox, WalletNotConnected, TokenImageBlock } from '@/components';
import { useUserMetrics } from '@/hooks';
import { AppTokenMetadata } from '@/models';

import {
  FeatureState, liquidityViewActions, modalsSliceActions, useAppDispatch, useLiquidityViewStore,
  useWalletStore, useSwapCanisterStore,
} from '@/store';

import { PairedUserLPToken, PairedUserLPTokenProps, RemoveLiquidityModal } from './components';

import { RetryFailedTrxModal } from '@/components/modals';

const INFORMATION_TITLE = 'Liquidity Provider Rewards';
const INFORMATION_DESCRIPTION = `Liquidity providers earn a 0.25% fee on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real-time, and can be claimed by withdrawing your liquidity. If you want to learn `;

const INFORMATION_LINK = 'https://docs.sonic.ooo/product/adding-liquidity/claiming-your-rewards';

const InformationDescription = () => {
  const color = useColorModeValue('gray.600', 'custom.1');

  return (
    <Text color={color}>
      {INFORMATION_DESCRIPTION}
      <Box as="a" color={color} href={INFORMATION_LINK} textDecoration="underline" _visited={{ color: color }}>
        review our documentation
      </Box>
      .
    </Text>
  );
};

export const LiquidityListView = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isConnected } = useWalletStore();

  const { allPairs, allPairsState, userLPBalances, userLPBalancesState, supportedTokenList, supportedTokenListState } = useSwapCanisterStore();
  const { isBannerOpened } = useLiquidityViewStore();
  const { isLoading: isMetricsLoading, userPairMetrics } = useUserMetrics();

  const moveToAddLiquidityView = (token0?: string, token1?: string) => {
    const query = token0 || token1
      ? `?${token0 ? `token0=${token0}` : ''}${token1 ? `&token1=${token1}` : ''
      }`
      : '';
    navigate(`/liquidity/add${query}`);
  };

  const handleInformationClose = () => { dispatch(liquidityViewActions.setIsBannerOpened(false)); };

  const handleOpenRemoveLiquidityModal = (token0: AppTokenMetadata, token1: AppTokenMetadata) => {
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
        const pairedList: PairedUserLPTokenProps[] = [];

        for (const tokenId1 in userLPBalances[tokenId0]) {
          if (existentPairs.has(`${tokenId1}:${tokenId0}`)) continue;
          existentPairs.add(`${tokenId0}:${tokenId1}`);

          const token0 = supportedTokenList.find((token) => token.id === tokenId0);
          const token1 = supportedTokenList.find((token) => token.id === tokenId1);

          let balance0, balance1;

          if (userLPBalances && allPairs && token0 && token1) {
            const lpBalance = userLPBalances[token0.id]?.[token1.id];
            const pair = allPairs[token0.id]?.[token1.id];

            const balances = Liquidity.getTokenBalances({
              decimals0: token0.decimals,
              decimals1: token1.decimals,
              reserve0: pair?.reserve0 ?? 0,
              reserve1: pair?.reserve1 ?? 0,
              totalSupply: pair?.totalSupply ?? 0,
              lpBalance,
            });

            balance0 = balances.balance0.toString();
            balance1 = balances.balance1.toString();
          }

          const userShares = toBigNumber(userLPBalances[tokenId0][tokenId1]).applyDecimals(Liquidity.PAIR_DECIMALS).toString();

          const totalShares = toBigNumber(
            allPairs?.[tokenId0]?.[tokenId1]?.totalSupply
          ).applyDecimals(Liquidity.PAIR_DECIMALS).toString();

          pairedList.push({
            pairId: allPairs?.[tokenId0]?.[tokenId1]?.id,
            token0,
            token1,
            balance0,
            balance1,
            userShares,
            totalShares,
            allPairs,
          } as PairedUserLPTokenProps);
        }

        return [...acc, ...pairedList];
      }, [] as PairedUserLPTokenProps[]);
    }
  }, [userLPBalances, supportedTokenList, allPairs]);

  const headerColor = useColorModeValue('gray.600', 'gray.400');
  const [isFailedTrxOpen, setIsFailedTrxOpen] = useState(0);
  const retryFailedTrx = () => { var r = Math.random() * 100; setIsFailedTrxOpen(r); };


  return (
    <div>
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
            mt={9}
          >
            <InformationDescription />
          </InformationBox>
        )}
      </Header>
      <RetryFailedTrxModal isRetryOpen={isFailedTrxOpen} />
      <RemoveLiquidityModal />

      {!isConnected ? (
        <WalletNotConnected message="Your liquidity positions will appear here." />
      ) : isLoading ? (
        <Stack spacing={4}>
          <Asset isLoading justifyContent="flex-start" gridGap={2}>
            <TokenImageBlock size={7} isLoading />
            <TokenImageBlock size={7} isLoading />
          </Asset>

          <Asset isLoading justifyContent="flex-start" gridGap={2}>
            <TokenImageBlock size={7} isLoading />
            <TokenImageBlock size={7} isLoading />
          </Asset>

          <Asset isLoading justifyContent="flex-start" gridGap={2}>
            <TokenImageBlock size={7} isLoading />
            <TokenImageBlock size={7} isLoading />
          </Asset>
        </Stack>
      ) : !pairedUserLPTokens?.length ? (
        <Text textAlign="center" color={headerColor}>
          You have no liquidity positions
        </Text>
      ) : (
        <Stack
          css={{ msOverflowStyle: 'none', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}
          spacing={4}  overflow="auto">
          {pairedUserLPTokens.map((userLPToken) => {

            return (
              <PairedUserLPToken {...userLPToken} key={userLPToken.pairId} handleRemove={handleOpenRemoveLiquidityModal}
                handleAdd={moveToAddLiquidityView} pairMetrics={userPairMetrics?.[userLPToken.pairId]}
                isMetricsLoading={isMetricsLoading} isLPBalanceLoading={isUserLPBalancesUpdating}
              />
            );
          })}
        </Stack>
      )}

      <Flex alignItems={'self-end'} w="100%" flexDirection="column" pb={40} mt={10}>
        <Flex>
          <Text mr={1} mt={1} color={'custom.1'}>Lost funds during LP addition? </Text>
          <Button size="sm" borderRadius={8} colorScheme="dark-blue" isLoading={isLoading} onClick={retryFailedTrx}>
            Claim Here
          </Button>
        </Flex>
      </Flex>

    </div>
  );
};
