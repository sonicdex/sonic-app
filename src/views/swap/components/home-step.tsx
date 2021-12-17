import { Box, Flex, Icon, IconButton, Tooltip } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { FaArrowDown } from 'react-icons/fa';

import {
  TitleBox,
  Token,
  Button,
  PlugButton,
  SlippageSettings,
  TokenContent,
  TokenDetails,
  TokenDetailsLogo,
  TokenDetailsSymbol,
  TokenBalances,
  TokenBalancesDetails,
  TokenBalancesPrice,
  TokenInput,
} from '@/components';
import { useBalances } from '@/hooks/use-balances';
import {
  INITIAL_SWAP_SLIPPAGE,
  SwapStep,
  swapViewActions,
  useAppDispatch,
  usePlugStore,
  useSwapStore,
  useSwapViewStore,
  useTokenModalOpener,
} from '@/store';
import { formatAmount, getCurrencyString } from '@/utils/format';
import { getAppAssetsSources } from '@/config/utils';

export const SwapHomeStep = () => {
  const { fromTokenOptions, toTokenOptions, from, to, slippage } =
    useSwapViewStore();
  const dispatch = useAppDispatch();
  const { sonicBalances, tokenBalances } = useSwapStore();
  const { isConnected } = usePlugStore();

  const openSelectTokenModal = useTokenModalOpener();

  const [autoSlippage, setAutoSlippage] = useState(true);

  const { totalBalances } = useBalances();

  const isLoading = useMemo(() => {
    if (!from.token) return true;
    return false;
  }, [totalBalances, from.token]);

  const [buttonDisabled, buttonMessage] = useMemo<[boolean, string]>(() => {
    if (isLoading) return [true, 'Loading'];
    if (!from.token) throw new Error('State is loading');
    if (!to.token) return [true, 'Select the token'];

    const parsedFromValue = (from.value && parseFloat(from.value)) || 0;

    if (parsedFromValue <= 0)
      return [true, `No ${from.token.name} value selected`];

    if (totalBalances) {
      const parsedBalance = parseFloat(
        formatAmount(totalBalances[from.token.id], from.token.decimals)
      );

      if (parsedFromValue > parsedBalance) {
        return [true, `Insufficient ${from.token.name} Balance`];
      }
    }

    return [false, 'Review Swap'];
  }, [isLoading, totalBalances, from.token, to.token, from.value, to.value]);

  const selectedTokenIds = useMemo(() => {
    let selectedIds = [];
    if (from?.token?.id) selectedIds.push(from.token.id);
    if (to?.token?.id) selectedIds.push(to.token.id);

    return selectedIds;
  }, [from?.token?.id, to?.token?.id]);

  const handleButtonOnClick = () => {
    if (isLoading) return;

    dispatch(swapViewActions.setStep(SwapStep.Review));
  };

  const switchTokens = () => {
    dispatch(swapViewActions.switchTokens());
  };

  const handleFromMaxClick = () => {
    dispatch(
      swapViewActions.setValue({
        data: 'from',
        value:
          totalBalances && from.token
            ? getCurrencyString(
                totalBalances[from.token?.id],
                from.token?.decimals
              )
            : '0.00',
      })
    );
  };

  const handleToMaxClick = () => {
    dispatch(
      swapViewActions.setValue({
        data: 'to',
        value:
          totalBalances && to.token
            ? getCurrencyString(totalBalances[to.token?.id], to.token?.decimals)
            : '0.00',
      })
    );
  };

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

  return (
    <>
      <TitleBox
        title="Swap"
        settings={
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
        }
      />
      <Flex direction="column" alignItems="center" mb={5}>
        <Box mt={5} width="100%">
          <Token
            value={from.value}
            setValue={(value) =>
              dispatch(swapViewActions.setValue({ data: 'from', value }))
            }
            tokenListMetadata={fromTokenOptions}
            tokenMetadata={from.token}
            isLoading={isLoading}
            price={0}
            sources={getAppAssetsSources({
              balances: {
                plug:
                  from.token && tokenBalances
                    ? tokenBalances[from.token.id]
                    : 0,
                sonic:
                  from.token && sonicBalances
                    ? sonicBalances[from.token.id]
                    : 0,
              },
            })}
          >
            <TokenContent>
              <TokenDetails onClick={handleSelectFromToken}>
                <TokenDetailsLogo />
                <TokenDetailsSymbol />
              </TokenDetails>

              <TokenInput />
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
            mt={-4}
            mb={-6}
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

        <Box mt={2.5} width="100%">
          <Token
            value={to.value}
            setValue={(value) =>
              dispatch(swapViewActions.setValue({ data: 'to', value }))
            }
            tokenListMetadata={toTokenOptions}
            tokenMetadata={to.token}
            isLoading={isLoading}
            price={0}
            isDisabled={true}
            sources={getAppAssetsSources({
              balances: {
                plug:
                  to.token && tokenBalances ? tokenBalances[to.token.id] : 0,
                sonic:
                  to.token && sonicBalances ? sonicBalances[to.token.id] : 0,
              },
            })}
          >
            <TokenContent>
              <TokenDetails onClick={handleSelectToToken}>
                <TokenDetailsLogo />
                <TokenDetailsSymbol />
              </TokenDetails>

              <TokenInput />
            </TokenContent>
            <TokenBalances>
              <TokenBalancesDetails onMaxClick={handleToMaxClick} />
              <TokenBalancesPrice />
            </TokenBalances>
          </Token>
        </Box>
      </Flex>

      {!isConnected ? (
        <PlugButton />
      ) : (
        <Button
          isFullWidth
          size="lg"
          onClick={handleButtonOnClick}
          isLoading={isLoading}
          isDisabled={buttonDisabled}
        >
          {buttonMessage}
        </Button>
      )}
    </>
  );
};
