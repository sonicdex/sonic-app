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
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaArrowDown } from '@react-icons/all-files/fa/FaArrowDown';
import { FaCog } from '@react-icons/all-files/fa/FaCog';
import { FaInfoCircle } from '@react-icons/all-files/fa/FaInfoCircle';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  PLUG_WALLET_WEBSITE_URL,
  PlugButton,
  SlippageSettings,
  Token,
  TokenContent,
  TokenData,
  TokenDataBalances,
  TokenDataPrice,
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
  usePriceStore,
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
  const { state: priceState } = usePriceStore();
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

  const isBalancesUpdating = useMemo(
    () => balancesState === FeatureState.Updating,
    [balancesState]
  );
  const isPriceUpdating = useMemo(
    () => priceState === FeatureState.Updating,
    [priceState]
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

  const handleMintWICP = useCallback(() => {
    if (checkIsPlugProviderVersionCompatible()) {
      addNotification({
        title: `Wrapping ${from.value} ${from.metadata?.symbol}`,
        type: NotificationType.MintWICP,
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

  const handleWithdrawWICP = useCallback(() => {
    addNotification({
      title: `Unwrapping ${from.value} ${from.metadata?.symbol}`,
      type: NotificationType.WithdrawWICP,
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
      return [false, 'Wrap', handleMintWICP];
    }

    if (isFromTokenIsWICP && isToTokenIsICP) {
      return [false, 'Unwrap', handleWithdrawWICP];
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
    handleMintWICP,
    handleWithdrawWICP,
    dispatch,
  ]);

  const headerTitle = useMemo(() => {
    if (isFromTokenIsICP && isToTokenIsXTC) {
      return 'Mint XTC';
    }

    if (isFromTokenIsICP && isToTokenIsWICP) {
      return 'Wrap';
    }

    if (isFromTokenIsWICP && isToTokenIsICP) {
      return 'Unwrap';
    }

    return 'Swap';
  }, [
    isFromTokenIsICP,
    isToTokenIsXTC,
    isToTokenIsWICP,
    isFromTokenIsWICP,
    isToTokenIsICP,
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
  };

  const handleMenuClose = () => {
    if (autoSlippage) {
      dispatch(swapViewActions.setSlippage(INITIAL_SWAP_SLIPPAGE));
    }
  };

  const swapPlacementButtonBg = useColorModeValue('gray.50', 'gray.800');
  const menuListShadow = useColorModeValue('lg', 'none');
  const menuListBg = useColorModeValue('gray.50', 'custom.3');
  const linkColor = useColorModeValue('dark-blue.500', 'dark-blue.400');

  return (
    <Stack spacing={4}>
      <ViewHeader title={headerTitle}>
        <Menu onClose={handleMenuClose}>
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
            <TokenData>
              <TokenDataBalances
                isUpdating={isBalancesUpdating}
                onMaxClick={() => handleMaxClick('from')}
              />
              <TokenDataPrice isUpdating={isPriceUpdating} />
            </TokenData>
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
            <TokenData>
              <TokenDataBalances isUpdating={isBalancesUpdating} />
              <TokenDataPrice
                isUpdating={isPriceUpdating}
                priceImpact={priceImpact}
              >
                {isToTokenIsXTC && isFromTokenIsICP && (
                  <Popover trigger="hover">
                    <PopoverTrigger>
                      <Box tabIndex={0}>
                        <FaInfoCircle />
                      </Box>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverBody>
                        <Text>
                          This price & percentage shows the current difference
                          between minting and swapping to XTC from ICP. If
                          negative, it's better to mint; if positive, it's
                          better to swap.{' '}
                          <Link
                            color={linkColor}
                            rel="noopener noreferrer"
                            target="_blank"
                            href={`${ENV.URLs.sonicDocs}/developer-guides/front-end-integrations#icp-xtc`}
                          >
                            Learn More.
                          </Link>
                        </Text>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                )}
              </TokenDataPrice>
            </TokenData>
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
