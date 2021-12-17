import { arrowDownSrc, infoSrc } from '@/assets';
import { Button, TitleBox, TokenBox } from '@/components';
import { getAppAssetsSources } from '@/config/utils';
import {
  NotificationType,
  SwapStep,
  SwapTokenDataKey,
  swapViewActions,
  useAppDispatch,
  useNotificationStore,
  useSwapStore,
  useSwapViewStore,
} from '@/store';
import { debounce } from '@/utils/function';
import {
  Box,
  Checkbox,
  Flex,
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
import { useMemo } from 'react';

export const ReviewStep = () => {
  const { sonicBalances, tokenBalances } = useSwapStore();

  const { fromTokenOptions, toTokenOptions, from, to, keepInSonic } =
    useSwapViewStore();
  const dispatch = useAppDispatch();

  const { addNotification } = useNotificationStore();

  const handleTokenSelect = (data: SwapTokenDataKey, tokenId: string) => {
    dispatch(swapViewActions.setToken({ data, tokenId }));
  };

  const handleApproveSwap = () => {
    addNotification({
      title: `Swapping ${from.token?.symbol} for ${to.token?.symbol}`,
      type: NotificationType.Swap,
      id: String(new Date().getTime()),
    });
    debounce(
      () => dispatch(swapViewActions.setValue({ data: 'from', value: '0.00' })),
      300
    );
  };

  const selectedTokenIds = useMemo(() => {
    let selectedIds = [];
    if (from?.token?.id) selectedIds.push(from.token.id);
    if (to?.token?.id) selectedIds.push(to.token.id);

    return selectedIds;
  }, [from?.token?.id, to?.token?.id]);

  return (
    <>
      <TitleBox
        title="Swap"
        onArrowBack={() => dispatch(swapViewActions.setStep(SwapStep.Home))}
      />
      <Flex direction="column" alignItems="center" mb={5}>
        <Box mt={5} width="100%">
          <TokenBox
            value={from.value}
            setValue={(value) =>
              dispatch(swapViewActions.setValue({ data: 'from', value }))
            }
            otherTokensMetadata={fromTokenOptions}
            selectedTokenMetadata={from.token}
            selectedTokenIds={selectedTokenIds}
            onTokenSelect={(tokenId) => handleTokenSelect('from', tokenId)}
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
            status="active"
            // balances={getCurrencyString(
            //   from.token && totalBalances ? totalBalances[from.token.id] : 0,
            //   from.token?.decimals
            // )}
          />
        </Box>
        <Box
          borderRadius={4}
          width={10}
          height={10}
          py={3}
          px={3}
          bg="#3D52F4"
          mt={-4}
          mb={-6}
          zIndex={1200}
        >
          <Image m="auto" src={arrowDownSrc} />
        </Box>
        <Box mt={2.5} width="100%">
          <TokenBox
            value={to.value}
            setValue={(value) =>
              dispatch(swapViewActions.setValue({ data: 'to', value }))
            }
            otherTokensMetadata={toTokenOptions}
            selectedTokenMetadata={to.token}
            selectedTokenIds={selectedTokenIds}
            onTokenSelect={(tokenId) => handleTokenSelect('to', tokenId)}
            price={0}
            sources={getAppAssetsSources({
              balances: {
                plug:
                  to.token && tokenBalances ? tokenBalances[to.token.id] : 0,
                sonic:
                  to.token && sonicBalances ? sonicBalances[to.token.id] : 0,
              },
            })}
            // balances={getCurrencyString(
            //   to.token && totalBalances ? totalBalances[to.token.id] : 0,
            //   to.token?.decimals
            // )}
            status="active"
            glow
            disabled
          />
        </Box>
      </Flex>
      <Flex
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        borderRadius={5}
        mb={5}
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
      <Button isFullWidth size="lg" onClick={handleApproveSwap}>
        Confirm Swap
      </Button>
    </>
  );
};
