import { Box, Flex, Icon, IconButton, Tooltip } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { FaArrowDown } from 'react-icons/fa';

import { TitleBox, TokenBox, Button, PlugButton } from '@/components';
import { useTotalBalances } from '@/hooks/use-balances';
import {
  SwapStep,
  swapViewActions,
  useAppDispatch,
  usePlugStore,
  useSwapStore,
  useSwapViewStore,
} from '@/store';
import { formatAmount, getCurrencyString } from '@/utils/format';
import { getAppAssetsSources } from '@/config/utils';

import { SwapSettings } from '../index';

export const HomeStep = () => {
  const { fromTokenOptions, toTokenOptions, from, to, slippage } =
    useSwapViewStore();
  const dispatch = useAppDispatch();
  const { sonicBalances, tokenBalances } = useSwapStore();
  const { isConnected } = usePlugStore();

  const [autoSlippage, setAutoSlippage] = useState(true);

  const { totalBalances } = useTotalBalances();

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

  const fromValueStatus = useMemo(() => {
    if (from.value && parseFloat(from.value) > 0) return 'active';
    return 'inactive';
  }, [from.value]);

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

  const handleTokenSelect = (data: any, tokenId: string) => {
    dispatch(swapViewActions.setToken({ data, tokenId }));
  };

  const switchTokens = () => {
    dispatch(swapViewActions.switchTokens());
  };

  return (
    <>
      <TitleBox
        title="Swap"
        settings={
          <SwapSettings
            slippage={slippage}
            setSlippage={(value) =>
              dispatch(swapViewActions.setSlippage(value))
            }
            isAuto={autoSlippage}
            setIsAuto={setAutoSlippage}
          />
        }
      />
      <Flex direction="column" alignItems="center" mb={5}>
        <Box mt={5} width="100%">
          <TokenBox
            value={from.value}
            onMaxClick={() =>
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
              )
            }
            setValue={(value) =>
              dispatch(swapViewActions.setValue({ data: 'from', value }))
            }
            otherTokensMetadata={fromTokenOptions}
            selectedTokenMetadata={from.token}
            onTokenSelect={(tokenId) => handleTokenSelect('from', tokenId)}
            selectedTokenIds={selectedTokenIds}
            status={fromValueStatus}
            isLoading={isLoading}
            price={53.23}
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
            // balances={getCurrencyString(
            //   from.token && totalBalance ? totalBalance[from.token.id] : 0,
            //   from.token?.decimals
            // )}
          />
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
          <TokenBox
            value={to.value}
            setValue={(value) =>
              dispatch(swapViewActions.setValue({ data: 'to', value }))
            }
            otherTokensMetadata={toTokenOptions}
            onTokenSelect={(tokenId) => handleTokenSelect('to', tokenId)}
            selectedTokenMetadata={to.token}
            disabled={true}
            isLoading={isLoading}
            price={53.23}
            sources={getAppAssetsSources({
              balances: {
                plug:
                  to.token && tokenBalances ? tokenBalances[to.token.id] : 0,
                sonic:
                  to.token && sonicBalances ? sonicBalances[to.token.id] : 0,
              },
            })}
            // balances={getCurrencyString(
            //   to.token && totalBalance ? totalBalance[to.token.id] : 0,
            //   to.token?.decimals
            // )}
          />
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
