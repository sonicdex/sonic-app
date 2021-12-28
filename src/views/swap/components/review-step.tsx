import { arrowDownSrc, infoSrc } from '@/assets';
import {
  ExchangeBox,
  TitleBox,
  Token,
  TokenBalances,
  TokenBalancesDetails,
  TokenBalancesPrice,
  TokenContent,
  TokenDetailsButton,
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
import {
  Box,
  Checkbox,
  Flex,
  Button,
  FormControl,
  Image,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from '@chakra-ui/react';

export const SwapReviewStep = () => {
  const { sonicBalances, tokenBalances } = useSwapCanisterStore();
  const { totalBalances } = useBalances();
  const { addNotification } = useNotificationStore();
  const { fromTokenOptions, toTokenOptions, from, to, keepInSonic, slippage } =
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
      <Flex direction="column" alignItems="center" mb={5}>
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
              <TokenDetailsButton>
                <TokenDetailsLogo />
                <TokenDetailsSymbol />
              </TokenDetailsButton>

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
      </Flex>
      <Flex
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        borderRadius={5}
        bg="#1E1E1E"
        px={5}
        py={4}
      >
        <FormControl direction="row" alignItems="center">
          <Checkbox
            isChecked={keepInSonic}
            onChange={(e) =>
              dispatch(swapViewActions.setKeepInSonic(e.target.checked))
            }
            colorScheme="dark-blue"
            size="lg"
            color={keepInSonic ? '#FFFFFF' : '#888E8F'}
            fontWeight={600}
          >
            Keep tokens in Sonic after swap
          </Checkbox>
        </FormControl>
        <Popover trigger="hover">
          <PopoverTrigger>
            <Image
              src={infoSrc}
              width={5}
              transition="opacity 200ms"
              opacity={keepInSonic ? 1 : 0.5}
            />
          </PopoverTrigger>
          <Portal>
            <PopoverContent
              p={2}
              bgColor="#292929"
              border="none"
              borderRadius={20}
            >
              <PopoverArrow bgColor="#292929" border="none" />
              <PopoverBody display="inline-block">
                Keeping tokens in Sonic (instead of withdrawing to Plug) is good
                for high frequency trading where a few extra seconds matters a
                lot. By doing this you can skip the deposit step on your next
                trade and save the 2-3 extra seconds.&nbsp;
                <Link href="/#" color="#3D52F4">
                  {/* TODO: add correct href */}
                  Learn More
                </Link>
                .
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      </Flex>

      <ExchangeBox from={from} to={to} slippage={slippage} />

      <Button
        variant="gradient"
        colorScheme="dark-blue"
        isFullWidth
        size="lg"
        onClick={handleApproveSwap}
      >
        Confirm Swap
      </Button>
    </>
  );
};
