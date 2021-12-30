import {
  Button,
  Box,
  Flex,
  Icon,
  IconButton,
  Tooltip,
  Stack,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { FaArrowDown } from 'react-icons/fa';

import {
  TitleBox,
  Token,
  PlugButton,
  SlippageSettings,
  TokenContent,
  TokenDetailsButton,
  TokenDetailsLogo,
  TokenDetailsSymbol,
  TokenBalances,
  TokenBalancesDetails,
  TokenBalancesPrice,
  TokenInput,
  ExchangeBox,
} from '@/components';
import { useBalances } from '@/hooks/use-balances';
import {
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
import { getAppAssetsSources } from '@/config/utils';
import { useTokenBalanceMemo } from '@/hooks';
import { ENV } from '@/config';
import { KeepInSonicBox } from './keep-in-sonic-box';
import { debounce } from '@/utils/function';
import { plug } from '@/integrations/plug';

export const SwapHomeStep = () => {
  const { addNotification } = useNotificationStore();
  const { fromTokenOptions, toTokenOptions, from, to, slippage } =
    useSwapViewStore();
  const dispatch = useAppDispatch();
  const { sonicBalances, tokenBalances, icpBalance } = useSwapCanisterStore();
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
        title: `Wrapping ${from.metadata?.symbol}`,
        type: NotificationType.Wrap,
        id: String(new Date().getTime()),
      });
      debounce(
        () => dispatch(swapViewActions.setValue({ data: 'from', value: '' })),
        300
      );
    } else {
      addNotification({
        title: `Please use latest version of the Plug`,
        type: NotificationType.Error,
        id: String(new Date().getTime()),
      });
    }
  };

  const handleUnwrapICP = () => {
    addNotification({
      title: `Unwrapping ${from.metadata?.symbol}`,
      type: NotificationType.Unwrap,
      id: String(new Date().getTime()),
    });
    debounce(
      () => dispatch(swapViewActions.setValue({ data: 'from', value: '' })),
      300
    );
  };

  const isLoading = useMemo(() => {
    if (!from.metadata || !totalBalances) return true;
    return false;
  }, [totalBalances, from.metadata]);

  const [buttonDisabled, buttonMessage, onButtonClick] = useMemo<
    [boolean, string, (() => void)?]
  >(() => {
    if (isLoading) return [true, 'Loading'];
    if (!from.metadata) throw new Error('State is loading');
    if (!to.metadata) return [true, 'Select a Token', () => {}];

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

    if (from.metadata.id === 'ICP' && to.metadata.id === ENV.canisterIds.WICP) {
      return [false, 'Wrap', handleWrapICP];
    }

    if (from.metadata.id === ENV.canisterIds.WICP && to.metadata.id === 'ICP') {
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
    totalBalances,
    fromBalance,
    from.metadata,
    to.metadata,
    from.value,
    to.value,
  ]);

  const selectedTokenIds = useMemo(() => {
    let selectedIds = [];
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
    return [from.metadata?.id === 'ICP', to.metadata?.id === 'ICP'];
  }, [from.metadata?.id, to.metadata?.id]);

  const isICPSelected = useMemo(() => {
    if (isFromIsICP || isToIsICP) return true;
    return false;
  }, [isFromIsICP, isToIsICP]);

  const fromSources = useMemo(() => {
    if (from.metadata) {
      if (from.metadata.id === 'ICP') {
        return getAppAssetsSources({
          balances: {
            plug: icpBalance ?? 0,
          },
        });
      }

      return getAppAssetsSources({
        balances: {
          plug:
            from.metadata && tokenBalances
              ? tokenBalances[from.metadata.id]
              : 0,
          sonic:
            from.metadata && sonicBalances
              ? sonicBalances[from.metadata.id]
              : 0,
        },
      });
    }
  }, [from.metadata, tokenBalances, sonicBalances]);

  const toSources = useMemo(() => {
    if (to.metadata) {
      if (to.metadata.id === 'ICP') {
        return getAppAssetsSources({
          balances: {
            plug: icpBalance ?? 0,
          },
        });
      }

      return getAppAssetsSources({
        balances: {
          plug:
            to.metadata && tokenBalances ? tokenBalances[to.metadata.id] : 0,
          sonic:
            to.metadata && sonicBalances ? sonicBalances[to.metadata.id] : 0,
        },
      });
    }
  }, [to.metadata, tokenBalances, sonicBalances]);

  return (
    <Stack spacing={4}>
      <TitleBox
        title="Swap"
        settings={
          !isLoading &&
          !isICPSelected && (
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
          )
        }
      />
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
            price={0}
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

        <Tooltip label="Swap">
          <IconButton
            aria-label="Swap"
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
            price={0}
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
                  variant="gradient"
                  colorScheme="dark-blue"
                >
                  {selectTokenButtonText}
                </TokenDetailsButton>
              )}

              <TokenInput />
            </TokenContent>
            <TokenBalances>
              <TokenBalancesDetails />
              <TokenBalancesPrice />
            </TokenBalances>
          </Token>
        </Box>
      </Flex>

      {!isICPSelected && (
        <ExchangeBox from={from} to={to} slippage={slippage} />
      )}
      {!isToIsICP && (
        <KeepInSonicBox
          symbol={to.metadata?.symbol}
          operation={isFromIsICP ? 'wrap' : 'swap'}
        />
      )}

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
