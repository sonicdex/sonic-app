import { Box, Button, Flex, Image, Stack } from '@chakra-ui/react';
import { useMemo } from 'react';

import { arrowDownSrc } from '@/assets';
import {
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
import { getAppAssetsSources } from '@/config/utils';
import { useTokenSelectionChecker } from '@/hooks';
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
  const { sonicBalances, tokenBalances } = useSwapCanisterStore();
  const { addNotification } = useNotificationStore();
  const { from, to } = useSwapViewStore();
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

  const {
    isFirstIsSelected: isFirstTokenIsICP,
    isSecondIsSelected: isSecondTokenIsICP,
  } = useTokenSelectionChecker({
    id0: from.metadata?.id,
    id1: to.metadata?.id,
  });

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
            <TokenData>
              <TokenDataBalances />
              <TokenDataPrice />
            </TokenData>
          </Token>
        </Box>
        <Box
          borderRadius={12}
          width={10}
          height={10}
          py={3}
          px={3}
          bg="dark-blue.500"
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
            <TokenData>
              <TokenDataBalances />
              <TokenDataPrice priceImpact={priceImpact} />
            </TokenData>
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
