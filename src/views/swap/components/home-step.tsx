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
  useSwapCanisterStore,
  useSwapViewStore,
  useTokenModalOpener,
} from '@/store';
import { formatAmount, getCurrencyString } from '@/utils/format';
import { getAppAssetsSources } from '@/config/utils';

export const SwapHomeStep = () => {
  const { fromTokenOptions, toTokenOptions, from, to, slippage } =
    useSwapViewStore();
  const dispatch = useAppDispatch();
  const { sonicBalances, tokenBalances } = useSwapCanisterStore();
  const { isConnected } = usePlugStore();

  const openSelectTokenModal = useTokenModalOpener();

  const [autoSlippage, setAutoSlippage] = useState(true);

  const { totalBalances } = useBalances();

  const isLoading = useMemo(() => {
    if (!from.metadata) return true;
    return false;
  }, [totalBalances, from.metadata]);

  const [buttonDisabled, buttonMessage] = useMemo<[boolean, string]>(() => {
    if (isLoading) return [true, 'Loading'];
    if (!from.metadata) throw new Error('State is loading');
    if (!to.metadata) return [true, 'Select the token'];

    const parsedFromValue = (from.value && parseFloat(from.value)) || 0;

    if (parsedFromValue <= 0)
      return [true, `No ${from.metadata.name} value selected`];

    if (totalBalances) {
      const parsedBalance = parseFloat(
        formatAmount(totalBalances[from.metadata.id], from.metadata.decimals)
      );

      if (parsedFromValue > parsedBalance) {
        return [true, `Insufficient ${from.metadata.name} Balance`];
      }
    }

    return [false, 'Review Swap'];
  }, [
    isLoading,
    totalBalances,
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
          totalBalances && from.metadata
            ? getCurrencyString(
                totalBalances[from.metadata?.id],
                from.metadata?.decimals
              )
            : '0.00',
      })
    );
  };

  // TODO: add if 2nd input will be unblocked
  // const handleToMaxClick = () => {
  //   dispatch(
  //     swapViewActions.setValue({
  //       data: 'to',
  //       value:
  //         totalBalances && to.token
  //           ? getCurrencyString(totalBalances[to.token?.id], to.token?.decimals)
  //           : '0.00',
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
            tokenMetadata={from.metadata}
            isLoading={isLoading}
            price={0}
            sources={getAppAssetsSources({
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
            })}
          >
            <TokenContent>
              <TokenDetails onClick={handleSelectFromToken}>
                <TokenDetailsLogo />
                <TokenDetailsSymbol />
              </TokenDetails>

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
            sources={getAppAssetsSources({
              balances: {
                plug:
                  to.metadata && tokenBalances
                    ? tokenBalances[to.metadata.id]
                    : 0,
                sonic:
                  to.metadata && sonicBalances
                    ? sonicBalances[to.metadata.id]
                    : 0,
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
              <TokenBalancesDetails />
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
