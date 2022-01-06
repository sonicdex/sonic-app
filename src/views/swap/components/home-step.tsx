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
} from '@chakra-ui/react';
import { FaArrowDown } from '@react-icons/all-files/fa/FaArrowDown';
import { FaCog } from '@react-icons/all-files/fa/FaCog';
import { useMemo, useState } from 'react';

import {
  ExchangeBox,
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
import { ICP_TOKEN_METADATA } from '@/constants';
import { useTokenBalanceMemo } from '@/hooks';
import { useBalances } from '@/hooks/use-balances';
import { plug } from '@/integrations/plug';
import {
  FeatureState,
  INITIAL_SWAP_SLIPPAGE,
  NotificationType,
  SwapStep,
  swapViewActions,
  useAppDispatch,
  useNotificationStore,
  usePlugStore,
  useSwapCanisterStore,
  useSwapViewStore,
  useTokenModalOpener,
} from '@/store';
import { formatAmount, getCurrency, getCurrencyString } from '@/utils/format';
import { debounce } from '@/utils/function';

import { KeepInSonicBox } from './keep-in-sonic-box';

export const SwapHomeStep = () => {
  const { addNotification } = useNotificationStore();
  const { fromTokenOptions, toTokenOptions, from, to, slippage } =
    useSwapViewStore();
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

  const openSelectTokenModal = useTokenModalOpener();

  const fromBalance = useTokenBalanceMemo(from.metadata?.id);
  // const toBalance = useTokenBalance(to.metadata?.id);

  const [autoSlippage, setAutoSlippage] = useState(true);

  const { totalBalances } = useBalances();

  const switchTokens = () => {
    dispatch(swapViewActions.switchTokens());
  };

  const handleFromMaxClick = () => {
    if (!fromBalance) return;
    dispatch(
      swapViewActions.setValue({
        data: 'from',
        value:
          totalBalances && from.metadata
            ? getCurrencyString(
                fromBalance - Number(from.metadata.fee),
                from.metadata?.decimals
              )
            : '',
      })
    );
  };

  // TODO: Add if 2nd input will be unblocked
  // const handleToMaxClick = () => {
  //   dispatch(
  //     swapViewActions.setValue({
  //       data: 'to',
  //       value:
  //         totalBalances && to.token
  //           ? getCurrencyString(toBalance!, to.metadata?.decimals)
  //           : '',
  //     })
  //   );
  // };

  const handleSelectFromToken = () => {
    openSelectTokenModal({
      metadata: fromTokenOptions,
      onSelect: (tokenId) =>
        dispatch(swapViewActions.setToken({ data: 'from', tokenId })),
      selectedTokenIds,
    });
  };

  const handleSelectToToken = () => {
    openSelectTokenModal({
      metadata: toTokenOptions,
      onSelect: (tokenId) =>
        dispatch(swapViewActions.setToken({ data: 'to', tokenId })),
      selectedTokenIds,
    });
  };

  const handleWrapICP = () => {
    const plugProviderVersionNumber = Number(
      plug?.versions.provider.split('.').join('')
    );

    if (plugProviderVersionNumber >= 160) {
      addNotification({
        title: `Wrapping ${from.value} ${from.metadata?.symbol}`,
        type: NotificationType.Wrap,
        id: String(new Date().getTime()),
      });
      debounce(
        () => dispatch(swapViewActions.setValue({ data: 'from', value: '' })),
        300
      );
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
    }
  };

  const handleUnwrapICP = () => {
    addNotification({
      title: `Unwrapping ${from.value} ${from.metadata?.symbol}`,
      type: NotificationType.Unwrap,
      id: String(new Date().getTime()),
    });
    debounce(
      () => dispatch(swapViewActions.setValue({ data: 'from', value: '' })),
      300
    );
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

    if (totalBalances) {
      const parsedBalance = parseFloat(
        formatAmount(fromBalance!, from.metadata.decimals)
      );

      if (parsedFromValue > parsedBalance) {
        return [true, `Insufficient ${from.metadata.symbol} Balance`];
      }
    }

    if (
      from.metadata.id === ICP_TOKEN_METADATA.id &&
      to.metadata.id === ENV.canisterIds.WICP
    ) {
      return [false, 'Wrap', handleWrapICP];
    }

    if (
      from.metadata.id === ENV.canisterIds.WICP &&
      to.metadata.id === ICP_TOKEN_METADATA.id
    ) {
      return [false, 'Unwrap', handleUnwrapICP];
    }

    return [
      false,
      'Review Swap',
      () => dispatch(swapViewActions.setStep(SwapStep.Review)),
    ];
  }, [
    handleUnwrapICP,
    handleWrapICP,
    dispatch,
    swapViewActions,
    isLoading,
    isFetchingNotStarted,
    totalBalances,
    fromBalance,
    from.metadata,
    to.metadata,
    from.value,
    to.value,
  ]);

  const selectedTokenIds = useMemo(() => {
    const selectedIds = [];
    if (from?.metadata?.id) selectedIds.push(from.metadata.id);
    if (to?.metadata?.id) selectedIds.push(to.metadata.id);

    return selectedIds;
  }, [from?.metadata?.id, to?.metadata?.id]);

  const [selectTokenButtonDisabled, selectTokenButtonText] = useMemo(() => {
    if (toTokenOptions && toTokenOptions.length <= 0)
      return [true, 'No pairs available'];
    return [false, 'Select a Token'];
  }, [toTokenOptions]);

  // TODO: Add hook(s) for this logic
  // Special cases for ICP
  const [isFromIsICP, isToIsICP] = useMemo(() => {
    return [
      from.metadata?.id === ICP_TOKEN_METADATA.id,
      to.metadata?.id === ICP_TOKEN_METADATA.id,
    ];
  }, [from.metadata?.id, to.metadata?.id]);

  const isICPSelected = useMemo(() => {
    if (isFromIsICP || isToIsICP) return true;
    return false;
  }, [isFromIsICP, isToIsICP]);

  const fromSources = useMemo(() => {
    if (from.metadata) {
      if (from.metadata.id === ICP_TOKEN_METADATA.id) {
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
  }, [from.metadata, tokenBalances, sonicBalances]);

  const toSources = useMemo(() => {
    if (to.metadata) {
      if (to.metadata.id === ICP_TOKEN_METADATA.id) {
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
  }, [to.metadata, tokenBalances, sonicBalances]);

  return (
    <Stack spacing={4}>
      <ViewHeader title="Swap">
        <Menu>
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
            bg="#1E1E1E"
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
              setIsAutoSlippage={(value) => {
                setAutoSlippage(value);
                dispatch(swapViewActions.setSlippage(INITIAL_SWAP_SLIPPAGE));
              }}
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
              <TokenDetailsButton onClick={handleSelectFromToken}>
                <TokenDetailsLogo />
                <TokenDetailsSymbol />
              </TokenDetailsButton>

              <TokenInput autoFocus />
            </TokenContent>
            <TokenBalances>
              <TokenBalancesDetails onMaxClick={handleFromMaxClick} />
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
            bg="gray.800"
            onClick={switchTokens}
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
                <TokenDetailsButton onClick={handleSelectToToken}>
                  <TokenDetailsLogo />
                  <TokenDetailsSymbol />
                </TokenDetailsButton>
              ) : (
                <TokenDetailsButton
                  onClick={handleSelectToToken}
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
              <TokenBalancesPrice shouldShowPriceDiff={!isICPSelected} />
            </TokenBalances>
          </Token>
        </Box>
      </Flex>

      <ExchangeBox from={from} to={to} slippage={slippage} />

      <KeepInSonicBox
        canHeldInSonic={!isToIsICP}
        symbol={to.metadata?.symbol}
        operation={isFromIsICP ? 'wrap' : 'swap'}
      />

      {!isConnected ? (
        <PlugButton />
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
