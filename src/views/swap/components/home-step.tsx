import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuList,
  Skeleton,
  Stack,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaArrowDown } from '@react-icons/all-files/fa/FaArrowDown';
import { FaCog } from '@react-icons/all-files/fa/FaCog';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  PLUG_WALLET_WEBSITE_URL,
  PlugButton,
  SlippageSettings,
  Token,
  TokenBalances,
  TokenBalancesDetails,
  TokenBalancesPrice,
  TokenContent,
  TokenDetailsButton,
  TokenDetailsLogo,
  TokenDetailsSymbol,
  TokenInput,
  ViewHeader,
} from '@/components';
import { ENV } from '@/config';
import { getAppAssetsSources } from '@/config/utils';
import { ICP_METADATA } from '@/constants';
import {
  useQuery,
  useTokenBalanceMemo,
  useTokenSelectionChecker,
} from '@/hooks';
import { useBalances } from '@/hooks/use-balances';
import { plug } from '@/integrations/plug';
import {
  FeatureState,
  INITIAL_SWAP_SLIPPAGE,
  NotificationType,
  SwapStep,
  SwapTokenDataKey,
  swapViewActions,
  useAppDispatch,
  useNotificationStore,
  usePlugStore,
  useSwapCanisterStore,
  useSwapViewStore,
  useTokenModalOpener,
} from '@/store';
import {
  calculatePriceImpact,
  getCurrency,
  getDepositMaxValue,
} from '@/utils/format';
import { debounce } from '@/utils/function';

import { ExchangeBox } from '.';
import { KeepInSonicBox } from './keep-in-sonic-box';

export const SwapHomeStep = () => {
  const { addNotification } = useNotificationStore();
  const { fromTokenOptions, toTokenOptions, from, to, slippage } =
    useSwapViewStore();
  const query = useQuery();
  const dispatch = useAppDispatch();
  const {
    sonicBalances,
    tokenBalances,
    icpBalance,
    balancesState,
    supportedTokenListState,
    allPairsState,
  } = useSwapCanisterStore();
  const { isConnected } = usePlugStore();
  const [autoSlippage, setAutoSlippage] = useState(true);

  const openSelectTokenModal = useTokenModalOpener();

  const {
    isFirstIsSelected: isFromTokenIsICP,
    isSecondIsSelected: isToTokenIsICP,
    isTokenSelected: isICPSelected,
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

  const { isSecondIsSelected: isToTokenIsXTC } = useTokenSelectionChecker({
    id0: from.metadata?.id,
    id1: to.metadata?.id,
    targetId: ENV.canistersPrincipalIDs.XTC,
  });

  const fromBalance = useTokenBalanceMemo(from.metadata?.id);
  const toBalance = useTokenBalanceMemo(to.metadata?.id);

  const { totalBalances } = useBalances();

  const switchTokens = () => {
    dispatch(swapViewActions.switchTokens());
  };

  const handleMaxClick = (key: SwapTokenDataKey) => {
    const balance = key === 'from' ? fromBalance : toBalance;
    const metadata = key === 'from' ? from.metadata : to.metadata;

    if (!balance) {
      return;
    }

    dispatch(
      swapViewActions.setValue({
        data: key,
        value: getDepositMaxValue(metadata, balance),
      })
    );
  };

  const handleSelectToken = (key: SwapTokenDataKey) => {
    const options = key === 'from' ? fromTokenOptions : toTokenOptions;

    openSelectTokenModal({
      metadata: options,
      onSelect: (tokenId) =>
        dispatch(swapViewActions.setToken({ data: key, tokenId })),
      selectedTokenIds,
    });
  };

  const isFetchingNotStarted = useMemo(
    () =>
      allPairsState === FeatureState.NotStarted ||
      supportedTokenListState === FeatureState.NotStarted,
    [supportedTokenListState, allPairsState]
  );

  const isLoading = useMemo(
    () =>
      balancesState === FeatureState.Loading ||
      supportedTokenListState === FeatureState.Loading ||
      allPairsState === FeatureState.Loading,
    [balancesState, supportedTokenListState, allPairsState]
  );

  const checkIsPlugProviderVersionCompatible = useCallback(() => {
    const plugProviderVersionNumber = Number(
      plug?.versions.provider.split('.').join('')
    );

    const plugInpageProviderVersionWithChainedBatchTranscations = 160;

    if (
      plugProviderVersionNumber >=
      plugInpageProviderVersionWithChainedBatchTranscations
    ) {
      return true;
    } else {
      addNotification({
        title: (
          <>
            You're using an outdated version of Plug, please update to the
            latest one{' '}
            <Link
              color="blue.400"
              href={PLUG_WALLET_WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </Link>
            .
          </>
        ),
        type: NotificationType.Error,
        id: String(new Date().getTime()),
      });
      return false;
    }
  }, [addNotification]);

  // TODO: calculate conversion rate and add more UI.
  const handleMintXTC = useCallback(() => {
    if (checkIsPlugProviderVersionCompatible()) {
      addNotification({
        title: `Minting ${to.value} ${to.metadata?.symbol}`,
        type: NotificationType.MintXTC,
        id: String(new Date().getTime()),
      });
      debounce(
        () => dispatch(swapViewActions.setValue({ data: 'from', value: '' })),
        300
      );
    }
  }, [
    addNotification,
    checkIsPlugProviderVersionCompatible,
    dispatch,
    to.metadata?.symbol,
    to.value,
  ]);

  const handleWrapICP = useCallback(() => {
    if (checkIsPlugProviderVersionCompatible()) {
      addNotification({
        title: `Wrapping ${from.value} ${from.metadata?.symbol}`,
        type: NotificationType.Wrap,
        id: String(new Date().getTime()),
      });
      debounce(
        () => dispatch(swapViewActions.setValue({ data: 'from', value: '' })),
        300
      );
    }
  }, [
    addNotification,
    checkIsPlugProviderVersionCompatible,
    dispatch,
    from.metadata?.symbol,
    from.value,
  ]);

  const handleUnwrapICP = useCallback(() => {
    addNotification({
      title: `Unwrapping ${from.value} ${from.metadata?.symbol}`,
      type: NotificationType.Unwrap,
      id: String(new Date().getTime()),
    });
    debounce(
      () => dispatch(swapViewActions.setValue({ data: 'from', value: '' })),
      300
    );
  }, [addNotification, dispatch, from.metadata?.symbol, from.value]);

  const [buttonDisabled, buttonMessage, onButtonClick] = useMemo<
    [boolean, string, (() => void)?]
  >(() => {
    if (isLoading) return [true, 'Loading'];
    if (isFetchingNotStarted || !from.metadata) return [true, 'Fetching'];
    if (!to.metadata) return [true, 'Select a Token'];

    if (toTokenOptions && toTokenOptions.length <= 0)
      return [true, 'No pairs available'];

    const parsedFromValue = (from.value && parseFloat(from.value)) || 0;

    if (parsedFromValue <= 0)
      return [true, `Enter ${from.metadata.symbol} Amount`];

    if (
      parsedFromValue <= getCurrency(from.metadata.fee, from.metadata.decimals)
    ) {
      return [true, `${from.metadata.symbol} amount must be greater than fee`];
    }

    const parsedToValue = (to.value && parseFloat(to.value)) || 0;

    if (parsedToValue <= getCurrency(to.metadata.fee, to.metadata.decimals)) {
      return [true, `${to.metadata.symbol} amount must be greater than fee`];
    }

    if (totalBalances && typeof fromBalance === 'number') {
      if (
        parsedFromValue > Number(getDepositMaxValue(from.metadata, fromBalance))
      ) {
        return [true, `Insufficient ${from.metadata.symbol} Balance`];
      }
    }

    if (isFromTokenIsICP && isToTokenIsWICP) {
      return [false, 'Wrap', handleWrapICP];
    }

    if (isFromTokenIsWICP && isToTokenIsICP) {
      return [false, 'Unwrap', handleUnwrapICP];
    }

    if (isFromTokenIsICP && isToTokenIsXTC) {
      return [false, 'Mint XTC', handleMintXTC];
    }

    return [
      false,
      'Review Swap',
      () => dispatch(swapViewActions.setStep(SwapStep.Review)),
    ];
  }, [
    isLoading,
    isFetchingNotStarted,
    from.metadata,
    from.value,
    to.metadata,
    to.value,
    toTokenOptions,
    totalBalances,
    fromBalance,
    isFromTokenIsICP,
    isToTokenIsXTC,
    isToTokenIsWICP,
    isFromTokenIsWICP,
    isToTokenIsICP,
    handleMintXTC,
    handleWrapICP,
    handleUnwrapICP,
    dispatch,
  ]);

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

  const selectedTokenIds = useMemo(() => {
    const selectedIds = [];
    if (from?.metadata?.id) selectedIds.push(from.metadata.id);

    return selectedIds;
  }, [from?.metadata?.id]);

  const [selectTokenButtonDisabled, selectTokenButtonText] = useMemo(() => {
    if (toTokenOptions && toTokenOptions.length <= 0)
      return [true, 'No pairs available'];
    return [false, 'Select a Token'];
  }, [toTokenOptions]);

  const fromSources = useMemo(() => {
    if (from.metadata) {
      if (from.metadata.id === ICP_METADATA.id) {
        return getAppAssetsSources({
          balances: {
            plug: icpBalance ?? 0,
          },
        });
      }

      return getAppAssetsSources({
        balances: {
          plug: tokenBalances ? tokenBalances[from.metadata.id] : 0,
          sonic: sonicBalances ? sonicBalances[from.metadata.id] : 0,
        },
      });
    }
  }, [from.metadata, tokenBalances, sonicBalances, icpBalance]);

  const toSources = useMemo(() => {
    if (to.metadata) {
      if (to.metadata.id === ICP_METADATA.id) {
        return getAppAssetsSources({
          balances: {
            plug: icpBalance ?? 0,
          },
        });
      }

      return getAppAssetsSources({
        balances: {
          plug: tokenBalances ? tokenBalances[to.metadata.id] : 0,
          sonic: sonicBalances ? sonicBalances[to.metadata.id] : 0,
        },
      });
    }
  }, [to.metadata, tokenBalances, sonicBalances, icpBalance]);

  useEffect(() => {
    if (!isLoading && fromTokenOptions && toTokenOptions) {
      const tokenFromId = query.get('from');
      const tokenToId = query.get('to');

      if (tokenFromId) {
        const from = fromTokenOptions.find(({ id }) => id === tokenFromId);
        if (from?.id) {
          dispatch(
            swapViewActions.setToken({ data: 'from', tokenId: from.id })
          );
          dispatch(swapViewActions.setValue({ data: 'from', value: '' }));
        }
      }

      if (tokenToId) {
        const to = toTokenOptions.find(({ id }) => id === tokenToId);
        if (to?.id) {
          dispatch(swapViewActions.setToken({ data: 'to', tokenId: to.id }));
          dispatch(swapViewActions.setValue({ data: 'to', value: '' }));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleSetIsAutoSlippage = (isAutoSlippage: boolean) => {
    setAutoSlippage(isAutoSlippage);
    dispatch(swapViewActions.setSlippage(INITIAL_SWAP_SLIPPAGE));
  };

  const swapPlacementButtonBg = useColorModeValue('gray.200', 'gray.800');
  const menuListBg = useColorModeValue('gray.50', 'custom.2');
  const menuListShadow = useColorModeValue('lg', 'none');

  return (
    <Stack spacing={4}>
      <ViewHeader title="Swap">
        <Menu
          onClose={() =>
            Number(slippage) >= 50 && handleSetIsAutoSlippage(true)
          }
        >
          <Tooltip label="Adjust the slippage">
            <MenuButton
              as={IconButton}
              isRound
              size="sm"
              aria-label="Adjust the slippage"
              icon={<FaCog />}
              ml="auto"
              isDisabled={isICPSelected}
            />
          </Tooltip>
          <MenuList
            bg={menuListBg}
            shadow={menuListShadow}
            border="none"
            borderRadius={20}
            ml={-20}
            py={0}
          >
            <SlippageSettings
              slippage={slippage}
              isAutoSlippage={autoSlippage}
              setSlippage={(value) =>
                dispatch(swapViewActions.setSlippage(value))
              }
              setIsAutoSlippage={handleSetIsAutoSlippage}
            />
          </MenuList>
        </Menu>
      </ViewHeader>
      <Flex direction="column" alignItems="center">
        <Box width="100%">
          <Token
            value={from.value}
            setValue={(value) =>
              dispatch(swapViewActions.setValue({ data: 'from', value }))
            }
            tokenListMetadata={fromTokenOptions}
            tokenMetadata={from.metadata}
            isLoading={isLoading}
            sources={fromSources}
          >
            <TokenContent>
              <TokenDetailsButton onClick={() => handleSelectToken('from')}>
                <TokenDetailsLogo />
                <TokenDetailsSymbol />
              </TokenDetailsButton>

              <TokenInput autoFocus />
            </TokenContent>
            <TokenBalances>
              <TokenBalancesDetails onMaxClick={() => handleMaxClick('from')} />
              <TokenBalancesPrice />
            </TokenBalances>
          </Token>
        </Box>

        <Tooltip label="Swap placement">
          <IconButton
            aria-label="Swap placement"
            icon={<Icon as={FaArrowDown} transition="transform 250ms" />}
            variant="outline"
            mt={-2}
            mb={-2}
            zIndex="overlay"
            bg={swapPlacementButtonBg}
            onClick={switchTokens}
            // TODO: Replace hardcoding with a proper solution
            isDisabled={!to.metadata || (isFromTokenIsICP && isToTokenIsXTC)}
            pointerEvents={!to.metadata ? 'none' : 'all'}
            _hover={{
              '& > svg': {
                transform: 'rotate(180deg)',
              },
            }}
          />
        </Tooltip>

        <Box width="100%">
          <Token
            value={to.value}
            setValue={(value) =>
              dispatch(swapViewActions.setValue({ data: 'to', value }))
            }
            tokenListMetadata={toTokenOptions}
            tokenMetadata={to.metadata}
            isLoading={isLoading}
            isDisabled={true}
            sources={toSources}
          >
            <TokenContent>
              {to.metadata ? (
                <TokenDetailsButton onClick={() => handleSelectToken('to')}>
                  <TokenDetailsLogo />
                  <TokenDetailsSymbol />
                </TokenDetailsButton>
              ) : (
                <TokenDetailsButton
                  onClick={() => handleSelectToken('to')}
                  isDisabled={selectTokenButtonDisabled}
                  variant={isLoading ? 'solid' : 'gradient'}
                  colorScheme={isLoading ? 'gray' : 'dark-blue'}
                >
                  <Skeleton isLoaded={!isLoading}>
                    {selectTokenButtonText}
                  </Skeleton>
                </TokenDetailsButton>
              )}

              <TokenInput />
            </TokenContent>
            <TokenBalances>
              <TokenBalancesDetails />
              <TokenBalancesPrice priceImpact={priceImpact} />
            </TokenBalances>
          </Token>
        </Box>
      </Flex>

      <ExchangeBox />

      <KeepInSonicBox
        canHeldInSonic={!isToTokenIsICP}
        symbol={to.metadata?.symbol}
        operation={
          isFromTokenIsICP && isToTokenIsWICP
            ? 'wrap'
            : isFromTokenIsICP && isToTokenIsXTC
            ? 'mint'
            : 'swap'
        }
      />

      {!isConnected ? (
        <PlugButton variant="dark" />
      ) : (
        <Button
          isFullWidth
          variant="gradient"
          colorScheme="dark-blue"
          size="lg"
          onClick={onButtonClick}
          isLoading={isLoading}
          isDisabled={buttonDisabled}
        >
          {buttonMessage}
        </Button>
      )}
    </Stack>
  );
};
