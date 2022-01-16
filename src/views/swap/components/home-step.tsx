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
import { useEffect, useMemo, useState } from 'react';

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
  useICPSelectionDetectorMemo,
  useQuery,
  useTokenBalanceMemo,
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
    allPairs,
    allPairsState,
  } = useSwapCanisterStore();
  const { isConnected } = usePlugStore();
  const [autoSlippage, setAutoSlippage] = useState(true);

  const openSelectTokenModal = useTokenModalOpener();

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

  const [buttonDisabled, buttonMessage, onButtonClick] = useMemo<
    [boolean, string, (() => void)?]
  >(() => {
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

    if (totalBalances && fromBalance) {
      if (
        parsedFromValue > Number(getDepositMaxValue(from.metadata, fromBalance))
      ) {
        return [true, `Insufficient ${from.metadata.symbol} Balance`];
      }
    }

    if (
      from.metadata.id === ICP_METADATA.id &&
      to.metadata.id === ENV.canistersPrincipalIDs.WICP
    ) {
      return [false, 'Wrap', handleWrapICP];
    }

    if (
      from.metadata.id === ENV.canistersPrincipalIDs.WICP &&
      to.metadata.id === ICP_METADATA.id
    ) {
      return [false, 'Unwrap', handleUnwrapICP];
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
    addNotification,
    dispatch,
  ]);

  const priceImpact = useMemo(() => {
    if (from.metadata?.id && to.metadata?.id) {
      const { reserve0, reserve1 } =
        allPairs?.[from.metadata.id]?.[to.metadata.id] || {};

      if (
        from.metadata?.decimals &&
        to.metadata?.decimals &&
        reserve0 &&
        reserve1
      ) {
        return calculatePriceImpact({
          amountIn: from.value,
          decimalsIn: from.metadata.decimals,
          decimalsOut: to.metadata.decimals,
          reserveIn: reserve0.toString(),
          reserveOut: reserve1.toString(),
        });
      }
    }

    return undefined;
  }, [from, to, allPairs]);

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

  const { isFirstTokenIsICP, isSecondTokenIsICP, isICPSelected } =
    useICPSelectionDetectorMemo(from.metadata?.id, to.metadata?.id);

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
            bg="custom.2"
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
            bg="gray.800"
            onClick={switchTokens}
            isDisabled={!to.metadata}
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
        canHeldInSonic={!isSecondTokenIsICP}
        symbol={to.metadata?.symbol}
        operation={isFirstTokenIsICP ? 'wrap' : 'swap'}
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
