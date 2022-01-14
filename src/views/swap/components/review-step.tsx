import { Box, Button, Flex, Image, Stack } from '@chakra-ui/react';
import { useMemo } from 'react';

import { arrowDownSrc } from '@/assets';
import {
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
import { getAppAssetsSources } from '@/config/utils';
import { useICPSelectionDetectorMemo } from '@/hooks';
import {
  NotificationType,
  SwapStep,
  swapViewActions,
  useAppDispatch,
  useNotificationStore,
  useSwapCanisterStore,
  useSwapViewStore,
} from '@/store';
import { calculatePriceImpact } from '@/utils/format';
import { debounce } from '@/utils/function';

import { ExchangeBox } from '.';
import { KeepInSonicBox } from './keep-in-sonic-box';

export const SwapReviewStep = () => {
  const { sonicBalances, tokenBalances, allPairs } = useSwapCanisterStore();
  const { addNotification } = useNotificationStore();
  const { fromTokenOptions, toTokenOptions, from, to } = useSwapViewStore();
  const dispatch = useAppDispatch();

  const handleApproveSwap = () => {
    addNotification({
      title: `Swap ${from.value} ${from.metadata?.symbol} for ${to.value} ${to.metadata?.symbol}`,
      type: NotificationType.Swap,
      id: String(new Date().getTime()),
    });
    debounce(
      () => dispatch(swapViewActions.setValue({ data: 'from', value: '' })),
      300
    );
  };

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

  const { isFirstTokenIsICP, isSecondTokenIsICP } = useICPSelectionDetectorMemo(
    from.metadata?.id,
    to.metadata?.id
  );

  return (
    <Stack spacing={4}>
      <ViewHeader
        title="Swap"
        onArrowBack={() => dispatch(swapViewActions.setStep(SwapStep.Home))}
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
              <TokenDetailsButton>
                <TokenDetailsLogo />
                <TokenDetailsSymbol />
              </TokenDetailsButton>

              <TokenInput />
            </TokenContent>
            <TokenBalances>
              <TokenBalancesDetails />
              <TokenBalancesPrice />
            </TokenBalances>
          </Token>
        </Box>
        <Box
          borderRadius={12}
          width={10}
          height={10}
          py={3}
          px={3}
          bg="dark-gray.500"
          mt={-2}
          mb={-2}
          zIndex={1200}
        >
          <Image alt="result" m="auto" src={arrowDownSrc} />
        </Box>
        <Box width="100%">
          <Token
            value={to.value}
            setValue={(value) =>
              dispatch(swapViewActions.setValue({ data: 'to', value }))
            }
            tokenListMetadata={toTokenOptions}
            tokenMetadata={to.metadata}
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
            shouldGlow
            isDisabled
          >
            <TokenContent>
              <TokenDetailsButton>
                <TokenDetailsLogo />
                <TokenDetailsSymbol />
              </TokenDetailsButton>

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

      <Button
        variant="gradient"
        colorScheme="dark-blue"
        isFullWidth
        size="lg"
        onClick={handleApproveSwap}
      >
        Confirm Swap
      </Button>
    </Stack>
  );
};
