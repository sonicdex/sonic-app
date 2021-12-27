import {
  HStack,
  Text,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  Stack,
} from '@chakra-ui/react';

import {
  InformationBox,
  Header,
  Asset,
  AssetImageBlock,
  AssetTitleBlock,
  AssetIconButton,
  PlugButton,
} from '@/components';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';

import {
  FeatureState,
  liquidityViewActions,
  modalsSliceActions,
  useAppDispatch,
  useLiquidityViewStore,
  usePlugStore,
  useSwapCanisterStore,
} from '@/store';

import { TokenMetadata } from '@/models';
import { getCurrencyString } from '@/utils/format';

const INFORMATION_TITLE = 'Liquidity Provider Rewards';
const INFORMATION_DESCRIPTION =
  'Liquidity providers earn a 0.25% fee on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity. If you want to learn ';

const InformationDescription = () => (
  <Text color="#888E8F">
    {INFORMATION_DESCRIPTION}
    <Box
      as="a"
      color="#888E8F"
      href="#"
      textDecoration="underline"
      _visited={{
        color: '#888E8F',
      }}
    >
      review our documentation
    </Box>
    .
  </Text>
);

type PairedUserLPToken = {
  token0: TokenMetadata;
  token1: TokenMetadata;
  balance: string;
};

export const Liquidity = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isConnected } = usePlugStore();
  const {
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
    token0: TokenMetadata,
    token1: TokenMetadata
  ) => {
    dispatch(liquidityViewActions.setToken({ data: 'token0', token: token0 }));
    dispatch(liquidityViewActions.setToken({ data: 'token1', token: token1 }));
    dispatch(modalsSliceActions.openRemoveLiquidityModal());
  };

  const isLoading = useMemo(() => {
    if (
      supportedTokenListState === FeatureState.Loading ||
      userLPBalancesState === FeatureState.Loading
    ) {
      return true;
    }

    return false;
  }, [supportedTokenListState, userLPBalancesState]);

  const pairedUserLPTokens = useMemo(() => {
    if (!isLoading && userLPBalances && supportedTokenList) {
      const lpBalancesPairIDs = Object.keys(userLPBalances);

      return lpBalancesPairIDs.reduce((acc, tokenId0) => {
        const tokenId1 = Object.keys(userLPBalances[tokenId0])[0];

        const token0 = supportedTokenList.find(
          (token) => token.id === tokenId0
        );
        const token1 = supportedTokenList.find(
          (token) => token.id === tokenId1
        );

        const balance = getCurrencyString(
          userLPBalances[tokenId0][tokenId1],
          token0?.decimals
        );

        return [
          ...acc,
          {
            token0,
            token1,
            balance,
          } as PairedUserLPToken,
        ];
      }, [] as PairedUserLPToken[]);
    }
  }, [isLoading, userLPBalances, supportedTokenList]);

  return (
    <>
      {isBannerOpened && (
        <InformationBox
          onClose={handleInformationClose}
          title={INFORMATION_TITLE}
          mb={9}
        >
          <InformationDescription />
        </InformationBox>
      )}
      <Header
        title="Your Liquidity Positions"
        buttonText="Create Position"
        onButtonClick={moveToAddLiquidityView}
      />

      {!isConnected ? (
        <>
          <Alert status="warning" mb={6}>
            <AlertIcon />
            <AlertTitle>You are not connected to the wallet</AlertTitle>
          </Alert>

          <PlugButton />
        </>
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
        <Text textAlign="center" color="gray.400">
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
          pb={8}
          overflow="auto"
        >
          {pairedUserLPTokens.map(({ token0, token1, balance }, index) => {
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
                <Box>
                  <Text fontWeight="bold" color="gray.400">
                    LP Tokens
                  </Text>
                  <Text fontWeight="bold">{balance}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" color="gray.400">
                    Fees Earned
                  </Text>
                  <Text fontWeight="bold" color="green.400">
                    ~$231.21
                  </Text>
                </Box>

                <HStack>
                  <AssetIconButton
                    aria-label="Remove liquidity"
                    icon={<FaMinus />}
                    onClick={() =>
                      handleOpenRemoveLiquidityModal(token0, token1)
                    }
                  />
                  <AssetIconButton
                    aria-label="Add liquidity"
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
