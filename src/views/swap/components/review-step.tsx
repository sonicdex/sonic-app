import { arrowDownSrc } from '@/assets';
import {
  Button,
  ExchangeBox,
  TitleBox,
  Token,
  TokenBalances,
  TokenBalancesDetails,
  TokenBalancesPrice,
  TokenContent,
  TokenDetails,
  TokenDetailsLogo,
  TokenDetailsSymbol,
  TokenInput,
} from '@/components';
import { getAppAssetsSources } from '@/config/utils';
import { useBalances } from '@/hooks/use-balances';
import {
  NotificationType,
  SwapStep,
  swapViewActions,
  useAppDispatch,
  useNotificationStore,
  useSwapCanisterStore,
  useSwapViewStore,
} from '@/store';
import { getCurrencyString } from '@/utils/format';
import { debounce } from '@/utils/function';
import { Box, Flex, Image } from '@chakra-ui/react';
import { KeepInSonicBox } from './keep-in-sonic-box';

export const SwapReviewStep = () => {
  const { sonicBalances, tokenBalances } = useSwapCanisterStore();
  const { totalBalances } = useBalances();
  const { addNotification } = useNotificationStore();
  const { fromTokenOptions, toTokenOptions, from, to, slippage } =
    useSwapViewStore();
  const dispatch = useAppDispatch();

  const handleApproveSwap = () => {
    addNotification({
      title: `Swapping ${from.metadata?.symbol} for ${to.metadata?.symbol}`,
      type: NotificationType.Swap,
      id: String(new Date().getTime()),
    });
    debounce(
      () => dispatch(swapViewActions.setValue({ data: 'from', value: '' })),
      300
    );
  };

  const handleMaxClick = () => {
    dispatch(
      swapViewActions.setValue({
        data: 'to',
        value:
          totalBalances && to.metadata
            ? getCurrencyString(
                totalBalances[to.metadata?.id],
                to.metadata?.decimals
              )
            : '',
      })
    );
  };

  return (
    <>
      <TitleBox
        title="Swap"
        onArrowBack={() => dispatch(swapViewActions.setStep(SwapStep.Home))}
      />
      <Flex direction="column" alignItems="center">
        <Box mt={5} width="100%">
          <Token
            value={from.value}
            setValue={(value) =>
              dispatch(swapViewActions.setValue({ data: 'from', value }))
            }
            tokenListMetadata={fromTokenOptions}
            tokenMetadata={from.metadata}
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
              <TokenDetails>
                <TokenDetailsLogo />
                <TokenDetailsSymbol />
              </TokenDetails>

              <TokenInput />
            </TokenContent>
            <TokenBalances>
              <TokenBalancesDetails onMaxClick={handleMaxClick} />
              <TokenBalancesPrice />
            </TokenBalances>
          </Token>
        </Box>
        <Box
          borderRadius={4}
          width={10}
          height={10}
          py={3}
          px={3}
          bg="#3D52F4"
          mt={-2}
          mb={-2}
          zIndex={1200}
        >
          <Image m="auto" src={arrowDownSrc} />
        </Box>
        <Box width="100%">
          <Token
            value={to.value}
            setValue={(value) =>
              dispatch(swapViewActions.setValue({ data: 'to', value }))
            }
            tokenListMetadata={toTokenOptions}
            tokenMetadata={to.metadata}
            price={0}
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
              <TokenDetails>
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

      <ExchangeBox from={from} to={to} slippage={slippage} />
      <KeepInSonicBox />

      <Button isFullWidth size="lg" onClick={handleApproveSwap}>
        Confirm Swap
      </Button>
    </>
  );
};
