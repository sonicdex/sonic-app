import {
  Flex,
  HStack,
  Icon,
  // AlertDescription,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaInfoCircle } from '@react-icons/all-files/fa/FaInfoCircle';
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
  TokenBalancesPopover,
} from '@/components';
import { getAppAssetsSources } from '@/config/utils';
import { ICP_METADATA } from '@/constants';
import { useBalances } from '@/hooks/use-balances';
import { AppTokenMetadata } from '@/models';
import {
  assetsViewActions,
  FeatureState,
  useAppDispatch,
  useAssetsViewStore,
  usePlugStore,
  usePriceStore,
  useSwapCanisterStore,
} from '@/store';
import { getCurrencyString } from '@/utils/format';

const getAssetPriceByBalanceAmount = (
  price?: string,
  balanceAmount?: number,
  decimals?: number
) => {
  if (price && balanceAmount && decimals) {
    return Number(price) * Number(getCurrencyString(balanceAmount, decimals));
  }

  return price;
};

export const AssetsListView = () => {
  const dispatch = useAppDispatch();
  const { isBannerOpened } = useAssetsViewStore();
  const { totalBalances, sonicBalances, tokenBalances } = useBalances();
  const { supportedTokenListState, balancesState, supportedTokenList } =
    useSwapCanisterStore();
  const { icpPrice } = usePriceStore();
  const { isConnected } = usePlugStore();

  const navigate = useNavigate();

  const navigateToDeposit = (tokenId?: string) => {
    if (tokenId) {
      navigate(`/assets/deposit?tokenId=${tokenId}`);
    }
  };

  const navigateToWithdraw = (tokenId?: string) => {
    if (tokenId) {
      navigate(`/assets/withdraw?tokenId=${tokenId}`);
    }
  };

  const handleBannerClose = () => {
    dispatch(assetsViewActions.setIsBannerOpened(false));
  };

  const notEmptyTokenList = useMemo(() => {
    const supportedTokenListWithICP: AppTokenMetadata[] = [
      Object.assign({}, ICP_METADATA, { price: icpPrice }),
      ...(supportedTokenList || []),
    ];

    if (totalBalances) {
      return supportedTokenListWithICP.filter(
        (token) => totalBalances[token.id] !== 0
      );
    }

    return [];
  }, [supportedTokenList, totalBalances, icpPrice]);

  const isTokenListPresent = useMemo(
    () => notEmptyTokenList && notEmptyTokenList.length > 0,
    [notEmptyTokenList]
  );

  const isLoading = useMemo(
    () =>
      supportedTokenListState === FeatureState.Loading ||
      balancesState === FeatureState.Loading,
    [supportedTokenListState, balancesState]
  );

  const isRefreshing = useMemo(
    () =>
      supportedTokenListState === FeatureState.Refreshing ||
      balancesState === FeatureState.Refreshing,
    [supportedTokenListState, balancesState]
  );

  const assetsDetailsTextColor = useColorModeValue('gray.800', 'custom.1');
  const headerColor = useColorModeValue('gray.600', 'gray.400');

  const getCanWithdraw = useCallback(
    (tokenId: string) => {
      return (
        tokenId !== ICP_METADATA.id &&
        sonicBalances &&
        sonicBalances[tokenId] > 0
      );
    },
    [sonicBalances]
  );

  const getCanDeposit = useCallback(
    (tokenId: string) => {
      return (
        tokenId !== ICP_METADATA.id &&
        tokenBalances &&
        tokenBalances[tokenId] > 0
      );
    },
    [tokenBalances]
  );

  return (
    <>
      <Header title="Your Assets" isRefreshing={isRefreshing}>
        {isBannerOpened && (
          <InformationBox
            title="Assets Details"
            mb={9}
            onClose={handleBannerClose}
          >
            <Text color={assetsDetailsTextColor}>
              View all the assets you have deposited or obtained on Sonic
              through our Liquidity and Swaps protocols, and deposit more or
              withdraw them to your wallet.
            </Text>
          </InformationBox>
        )}
      </Header>

      {!isConnected ? (
        <PlugNotConnected message="Your assets will appear here." />
      ) : (
        <Stack spacing={4} pb={8} flex={1}>
          {isLoading ? (
            <>
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
            </>
          ) : isTokenListPresent ? (
            notEmptyTokenList.map(
              ({ id, name, symbol, decimals, price, logo }) => (
                <Asset key={id} imageSources={[logo]}>
                  <HStack
                    spacing={4}
                    flex={2}
                    maxW="180px"
                    overflow="hidden"
                    mr={4}
                  >
                    <AssetImageBlock />
                    <AssetTitleBlock
                      title={symbol}
                      subtitle={name}
                      overflow="hidden"
                    />
                  </HStack>

                  <TokenBalancesPopover
                    sources={getAppAssetsSources({
                      balances: {
                        plug:
                          id === ICP_METADATA.id
                            ? totalBalances?.[id]
                            : tokenBalances?.[id],
                        sonic: sonicBalances?.[id],
                      },
                    })}
                    decimals={decimals}
                    symbol={symbol}
                  >
                    <Flex flex={1} direction="column">
                      <Text
                        fontWeight="bold"
                        color={headerColor}
                        display="flex"
                        alignItems="center"
                      >
                        Balance
                        <Icon
                          as={FaInfoCircle}
                          w={4}
                          h={4}
                          ml={1.5}
                          opacity={0.45}
                        />
                      </Text>
                      <DisplayValue
                        value={totalBalances?.[id]}
                        decimals={decimals}
                        fontWeight="bold"
                        disableTooltip
                      />
                    </Flex>
                  </TokenBalancesPopover>
                  <Flex flex={1} direction="column">
                    <Text fontWeight="bold" color={headerColor}>
                      Price
                    </Text>
                    <DisplayValue
                      fontWeight="bold"
                      prefix="~$"
                      value={
                        getAssetPriceByBalanceAmount(
                          price,
                          totalBalances?.[id],
                          decimals
                        ) ?? 0
                      }
                    />
                  </Flex>

                  <HStack>
                    <AssetIconButton
                      aria-label={`Withdraw ${symbol}`}
                      icon={<FaMinus />}
                      onClick={() => navigateToWithdraw(id)}
                      isDisabled={!getCanWithdraw(id)}
                    />
                    <AssetIconButton
                      colorScheme="dark-blue"
                      aria-label={`Deposit ${symbol}`}
                      icon={<FaPlus />}
                      onClick={() => navigateToDeposit(id)}
                      isDisabled={!getCanDeposit(id)}
                    />
                  </HStack>
                </Asset>
              )
            )
          ) : (
            <Text textAlign="center" color={headerColor}>
              No assets available
            </Text>
          )}
        </Stack>
      )}
    </>
  );
};
