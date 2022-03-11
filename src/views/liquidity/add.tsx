import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { Liquidity, toBigNumber } from '@psychedelic/sonic-js';
import { FaCog } from '@react-icons/all-files/fa/FaCog';
import { FaEquals } from '@react-icons/all-files/fa/FaEquals';
import { FaInfoCircle } from '@react-icons/all-files/fa/FaInfoCircle';
import { FaPlus } from '@react-icons/all-files/fa/FaPlus';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import {
  DisplayValue,
  LPImageBlock,
  PlugButton,
  SlippageSettings,
  StackLine,
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
import { useTokenBalanceMemo } from '@/hooks';
import { useBalances } from '@/hooks/use-balances';
import { useQuery } from '@/hooks/use-query';
import {
  FeatureState,
  INITIAL_LIQUIDITY_SLIPPAGE,
  LiquidityTokenDataKey,
  liquidityViewActions,
  NotificationType,
  useAppDispatch,
  useLiquidityViewStore,
  useNotificationStore,
  usePlugStore,
  usePriceStore,
  useSwapCanisterStore,
  useTokenModalOpener,
} from '@/store';
import { getMaxValue } from '@/utils/format';
import { debounce } from '@/utils/function';

import { getShareOfPoolString } from './liquidity.utils';

export const LiquidityAddView = () => {
  const query = useQuery();

  const { isConnected } = usePlugStore();

  const { addNotification } = useNotificationStore();
  const { token0, token1, slippage, pair, pairState } = useLiquidityViewStore();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { tokenBalances, sonicBalances, totalBalances } = useBalances();
  const { supportedTokenList, supportedTokenListState, balancesState } =
    useSwapCanisterStore();
  const { state: priceState } = usePriceStore();
  const openSelectTokenModal = useTokenModalOpener();

  const [isReviewing, setIsReviewing] = useState(false);
  const [autoSlippage, setAutoSlippage] = useState(true);

  const handlePreviousStep = () => {
    if (isReviewing) {
      setIsReviewing(false);
    } else {
      navigate('/liquidity');
    }
  };

  const handleAddLiquidity = () => {
    if (!isReviewing) {
      setIsReviewing(true);
      return;
    }

    addNotification({
      title: `Add LP of ${token0.value} ${token0.metadata?.symbol} + ${token1.value} ${token1.metadata?.symbol}`,
      type: NotificationType.AddLiquidity,
      id: String(new Date().getTime()),
    });

    debounce(() => {
      dispatch(liquidityViewActions.setValue({ data: 'token0', value: '' }));
      dispatch(liquidityViewActions.setValue({ data: 'token1', value: '' }));
      setIsReviewing(false);
      navigate('/liquidity');
    }, 300);
  };

  const handleTokenMaxClick = (dataKey: LiquidityTokenDataKey) => {
    const token = dataKey === 'token0' ? token0 : token1;
    const tokenBalance = dataKey === 'token0' ? token0Balance : token1Balance;

    if (!token || !tokenBalance) return;

    const maxValue = getMaxValue(token.metadata, tokenBalance).toString();

    setInAndOutTokenValues(dataKey, maxValue);
  };

  const handleSelectToken = (dataKey: LiquidityTokenDataKey) => {
    if (!isReviewing) {
      openSelectTokenModal({
        metadata: supportedTokenList,
        onSelect: (tokenId) => {
          if (tokenId && supportedTokenList) {
            if (
              token0.metadata?.id === tokenId ||
              token1.metadata?.id === tokenId
            ) {
              return;
            }

            const foundToken = supportedTokenList.find(
              ({ id }) => id === tokenId
            );

            dispatch(
              liquidityViewActions.setToken({
                data: dataKey,
                token: foundToken,
              })
            );
            dispatch(
              liquidityViewActions.setValue({ data: 'token0', value: '' })
            );
            dispatch(
              liquidityViewActions.setValue({ data: 'token1', value: '' })
            );
          }
        },
        selectedTokenIds,
      });
    }
  };

  // Utils

  const setInAndOutTokenValues = useCallback(
    (dataKey: LiquidityTokenDataKey, value?: string) => {
      const [amountIn, reserveIn, reserveOut, decimalsIn, decimalsOut] =
        dataKey === 'token0'
          ? [
              value ?? token0.value,
              String(pair?.reserve0),
              String(pair?.reserve1),
              Number(token0.metadata?.decimals),
              Number(token1.metadata?.decimals),
            ]
          : [
              value ?? token1.value,
              String(pair?.reserve1),
              String(pair?.reserve0),
              Number(token1.metadata?.decimals),
              Number(token0.metadata?.decimals),
            ];

      dispatch(
        liquidityViewActions.setValue({ data: dataKey, value: amountIn })
      );

      if (token0.metadata && token1.metadata) {
        const lpValue = Liquidity.getOppositeAmount({
          amountIn,
          reserveIn,
          reserveOut,
          decimalsIn,
          decimalsOut,
        });

        const reversedDataKey = dataKey === 'token0' ? 'token1' : 'token0';

        if (lpValue.gt(0)) {
          dispatch(
            liquidityViewActions.setValue({
              data: reversedDataKey,
              value: lpValue.toString(),
            })
          );
        }
      }
    },
    [
      dispatch,
      pair?.reserve0,
      pair?.reserve1,
      token0.metadata,
      token0.value,
      token1.metadata,
      token1.value,
    ]
  );

  // Memorized values

  const token0Balance = useTokenBalanceMemo(token0.metadata?.id);
  const token1Balance = useTokenBalanceMemo(token1.metadata?.id);

  const isLoading = useMemo(
    () =>
      supportedTokenListState === FeatureState.Loading ||
      pairState === FeatureState.Loading,
    [supportedTokenListState, pairState]
  );

  const isBalancesUpdating = useMemo(
    () => balancesState === FeatureState.Updating,
    [balancesState]
  );
  const isPriceUpdating = useMemo(
    () => priceState === FeatureState.Updating,
    [priceState]
  );

  const [buttonDisabled, buttonMessage] = useMemo<[boolean, string]>(() => {
    if (isLoading) return [true, 'Loading'];
    if (!token0.metadata || !token1.metadata) return [true, 'Select Tokens'];

    const parsedToken0Value = (token0.value && parseFloat(token0.value)) || 0;
    const parsedToken1Value = (token1.value && parseFloat(token1.value)) || 0;

    if (parsedToken0Value <= 0)
      return [true, `Enter ${token0.metadata.symbol} Amount`];

    if (parsedToken1Value <= 0)
      return [true, `Enter ${token1.metadata.symbol} Amount`];

    if (
      totalBalances &&
      typeof token0Balance === 'number' &&
      typeof token1Balance === 'number'
    ) {
      if (
        parsedToken0Value >
        getMaxValue(token0.metadata, token0Balance).toNumber()
      ) {
        return [true, `Insufficient ${token0.metadata.symbol} Balance`];
      }

      if (
        parsedToken1Value >
        getMaxValue(token1.metadata, token1Balance).toNumber()
      ) {
        return [true, `Insufficient ${token1.metadata.symbol} Balance`];
      }
    }

    if (isReviewing) return [false, 'Confirm Supply'];
    return [false, 'Review Supply'];
  }, [
    isLoading,
    token0,
    token1,
    totalBalances,
    token0Balance,
    token1Balance,
    isReviewing,
  ]);

  const selectedTokenIds = useMemo(() => {
    const selectedIds = [];
    if (token0?.metadata?.id) selectedIds.push(token0.metadata.id);
    if (token1?.metadata?.id) selectedIds.push(token1.metadata.id);

    return selectedIds;
  }, [token0?.metadata?.id, token1?.metadata?.id]);

  const { fee0, fee1, price0, price1, shareOfPool, liquidityAmount } =
    useMemo(() => {
      console.log('token0.value', token0.value);
      console.log('token1.value', token1.value);
      console.log('---');
      if (token0.metadata && token1.metadata && token0.value && token1.value) {
        const fee0 = toBigNumber(token0.metadata.fee)
          .multipliedBy(2)
          .applyDecimals(token0.metadata.decimals)
          .toString();

        const fee1 = toBigNumber(token1.metadata.fee)
          .multipliedBy(2)
          .applyDecimals(token1.metadata.decimals)
          .toString();

        if (pair?.reserve0 && pair?.reserve1) {
          const price0 = Liquidity.getOppositeAmount({
            amountIn: '1',
            reserveIn: pair.reserve1,
            reserveOut: pair.reserve0,
            decimalsIn: token1.metadata.decimals,
            decimalsOut: token0.metadata.decimals,
          }).toString();

          const price1 = Liquidity.getOppositeAmount({
            amountIn: '1',
            reserveIn: pair.reserve0,
            reserveOut: pair.reserve1,
            decimalsIn: token0.metadata.decimals,
            decimalsOut: token1.metadata.decimals,
          }).toString();

          const options = {
            amount0: token0.value,
            amount1: token1.value,
            decimals0: token0.metadata?.decimals,
            decimals1: token1.metadata?.decimals,
            reserve0: pair.reserve0,
            reserve1: pair.reserve1,
            totalSupply: pair.totalSupply,
          };

          const liquidityAmount = Liquidity.getPosition(options)
            .applyDecimals(Liquidity.PAIR_DECIMALS)
            .toString();

          const shareOfPool = getShareOfPoolString(options);

          return {
            fee0,
            fee1,
            price0,
            price1,
            liquidityAmount,
            shareOfPool,
          };
        } else {
          const token0Value = toBigNumber(token1.value)
            .div(token0.value)
            .dp(token0.metadata.decimals);

          const token1Value = toBigNumber(token0.value)
            .div(token1.value)
            .dp(token1.metadata.decimals);

          const price0 =
            token0Value.isNaN() || token0Value.isZero()
              ? 0
              : token0Value.toString();

          const price1 =
            token1Value.isNaN() || token1Value.isZero()
              ? 0
              : token1Value.toString();

          const liquidityAmount = toBigNumber(
            Liquidity.getPosition({
              amount0: token0.value,
              amount1: token1.value,
              decimals0: token0.metadata.decimals,
              decimals1: token1.metadata.decimals,
              reserve0: 0,
              reserve1: 0,
              totalSupply: 0,
            })
          )
            .applyDecimals(Liquidity.PAIR_DECIMALS)
            .toString();

          return {
            fee0,
            fee1,
            price0,
            price1,
            shareOfPool: '100%',
            liquidityAmount,
          };
        }
      }

      return {
        fee0: '0',
        fee1: '0',
        price0: '0',
        price1: '0',
      };
    }, [token0, token1, pair]);

  const token0Sources = useMemo(() => {
    if (token0.metadata) {
      return getAppAssetsSources({
        balances: {
          plug: tokenBalances ? tokenBalances[token0.metadata.id] : 0,
          sonic: sonicBalances ? sonicBalances[token0.metadata.id] : 0,
        },
      });
    }
  }, [token0.metadata, tokenBalances, sonicBalances]);

  const token1Sources = useMemo(() => {
    if (token1.metadata) {
      return getAppAssetsSources({
        balances: {
          plug: tokenBalances ? tokenBalances[token1.metadata.id] : 0,
          sonic: sonicBalances ? sonicBalances[token1.metadata.id] : 0,
        },
      });
    }
  }, [token1.metadata, tokenBalances, sonicBalances]);

  useEffect(() => {
    if (!isLoading && supportedTokenList) {
      const token1Id = query.get('token1');
      const token0Id = query.get('token0');

      if (token0Id) {
        const token0 = supportedTokenList.find(({ id }) => id === token0Id);
        dispatch(
          liquidityViewActions.setToken({
            data: 'token0',
            token: token0,
          })
        );
        dispatch(liquidityViewActions.setValue({ data: 'token0', value: '' }));
      }

      if (token1Id) {
        const token1 = supportedTokenList.find(({ id }) => id === token1Id);
        dispatch(
          liquidityViewActions.setToken({ data: 'token1', token: token1 })
        );
        dispatch(liquidityViewActions.setValue({ data: 'token1', value: '' }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleSetIsAutoSlippage = (isAutoSlippage: boolean) => {
    setAutoSlippage(isAutoSlippage);
  };

  const handleMenuClose = () => {
    if (autoSlippage) {
      dispatch(liquidityViewActions.setSlippage(INITIAL_LIQUIDITY_SLIPPAGE));
    }
  };

  const menuListShadow = useColorModeValue('lg', 'none');
  const menuListBg = useColorModeValue('gray.50', 'custom.3');
  const color = useColorModeValue('gray.600', 'custom.1');
  const bg = useColorModeValue('gray.100', 'gray.800');
  const iconBorderColor = useColorModeValue('gray.200', 'custom.4');
  const textColor = useColorModeValue('gray.700', 'gray.300');

  return (
    <Stack spacing={4}>
      <ViewHeader onArrowBack={handlePreviousStep} title="Add Liquidity">
        <Menu onClose={handleMenuClose}>
          <Tooltip label="Adjust the slippage">
            <MenuButton
              as={IconButton}
              isRound
              size="sm"
              aria-label="Adjust the slippage"
              icon={<FaCog />}
              ml="auto"
            />
          </Tooltip>
          <MenuList
            shadow={menuListShadow}
            bg={menuListBg}
            border="none"
            borderRadius={20}
            py={0}
          >
            <SlippageSettings
              slippage={slippage}
              setSlippage={(value) =>
                dispatch(liquidityViewActions.setSlippage(value))
              }
              isAutoSlippage={autoSlippage}
              setIsAutoSlippage={handleSetIsAutoSlippage}
            />
          </MenuList>
        </Menu>
      </ViewHeader>
      <Flex direction="column" alignItems="center">
        <Box width="100%">
          <Token
            value={token0.value}
            setValue={(value) => setInAndOutTokenValues('token0', value)}
            tokenListMetadata={supportedTokenList}
            tokenMetadata={token0.metadata}
            isDisabled={isReviewing}
            sources={token0Sources}
            isLoading={isLoading}
          >
            <TokenContent>
              <TokenDetailsButton onClick={() => handleSelectToken('token0')}>
                <TokenDetailsLogo />
                <TokenDetailsSymbol />
              </TokenDetailsButton>

              <TokenInput autoFocus />
            </TokenContent>
            <TokenData>
              <TokenDataBalances
                isUpdating={isBalancesUpdating}
                onMaxClick={() => handleTokenMaxClick('token0')}
              />
              <TokenDataPrice isUpdating={isPriceUpdating} />
            </TokenData>
          </Token>
        </Box>

        <Center
          borderRadius={12}
          width={10}
          height={10}
          border="1px solid"
          borderColor={iconBorderColor}
          bg={menuListBg}
          mt={-2}
          mb={-2}
          zIndex="docked"
        >
          <Icon as={FaPlus} />
        </Center>

        <Box width="100%">
          <Token
            value={token1.value}
            setValue={(value) => setInAndOutTokenValues('token1', value)}
            tokenListMetadata={supportedTokenList}
            tokenMetadata={token1.metadata}
            isDisabled={isReviewing}
            sources={token1Sources}
            isLoading={isLoading}
          >
            <TokenContent>
              {token1.metadata ? (
                <TokenDetailsButton onClick={() => handleSelectToken('token1')}>
                  <TokenDetailsLogo />
                  <TokenDetailsSymbol />
                </TokenDetailsButton>
              ) : (
                <TokenDetailsButton
                  onClick={() => handleSelectToken('token1')}
                  variant={isLoading ? 'solid' : 'gradient'}
                  colorScheme={isLoading ? 'gray' : 'dark-blue'}
                >
                  <Skeleton isLoaded={!isLoading}>Select a Token</Skeleton>
                </TokenDetailsButton>
              )}

              <TokenInput />
            </TokenContent>
            <TokenData>
              <TokenDataBalances
                isUpdating={isBalancesUpdating}
                onMaxClick={() => handleTokenMaxClick('token1')}
              />
              <TokenDataPrice isUpdating={isPriceUpdating} />
            </TokenData>
          </Token>
        </Box>
        {token0.metadata && token1.metadata && (
          <>
            {isReviewing && (
              <>
                <Center
                  borderRadius={12}
                  width={10}
                  height={10}
                  border="1px solid"
                  borderColor={iconBorderColor}
                  bg={menuListBg}
                  mt={-2}
                  mb={-2}
                  justifyContent="center"
                  alignItems="center"
                  zIndex="docked"
                >
                  <Icon as={FaEquals} />
                </Center>

                <Token value={liquidityAmount} isDisabled shouldGlow>
                  <TokenContent>
                    <Flex
                      borderRadius="full"
                      mr={5}
                      minWidth="fit-content"
                      background={bg}
                      height={10}
                      px={4}
                      justifyContent="center"
                      alignItems="center"
                      fontWeight="bold"
                    >
                      <LPImageBlock
                        imageSources={[
                          token0.metadata?.logo,
                          token1.metadata?.logo,
                        ]}
                        size="sm"
                      />
                      <Text ml={2.5}>
                        {`${token0.metadata?.symbol}-${token1.metadata?.symbol}`}
                      </Text>

                      <Popover trigger="hover">
                        <PopoverTrigger>
                          <Flex>
                            <Icon as={FaInfoCircle} ml={2.5} width={4} />
                          </Flex>
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverBody>
                            This is your share of the liquidity pool represented
                            as tokens
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Flex>

                    <TokenInput />
                  </TokenContent>
                  <TokenData color={color}>
                    Share of Pool:
                    <Text flex={1} textAlign="right">
                      {shareOfPool}
                    </Text>
                  </TokenData>
                </Token>
              </>
            )}

            {liquidityAmount && (
              <Flex
                alignItems="center"
                justifyContent="space-between"
                width="full"
                mt={5}
                px={5}
              >
                <Text color={textColor}>
                  {`1 ${token0.metadata?.symbol} = `}{' '}
                  <DisplayValue as="span" value={price1} />{' '}
                  {` ${token1.metadata?.symbol}`}
                </Text>
                <HStack>
                  <Text color={textColor}>
                    {`1 ${token1.metadata?.symbol} = `}{' '}
                    <DisplayValue as="span" value={price0} />{' '}
                    {`${token0.metadata?.symbol}`}
                  </Text>
                  <Popover trigger="hover">
                    <PopoverTrigger>
                      <Flex>
                        <Icon
                          as={FaInfoCircle}
                          width={5}
                          transition="opacity 200ms"
                          opacity={0.6}
                        />
                      </Flex>
                    </PopoverTrigger>
                    <PopoverContent minWidth="400px">
                      <PopoverHeader>Transaction Details</PopoverHeader>
                      <PopoverArrow />
                      <PopoverBody display="inline-block">
                        <Stack>
                          <StackLine
                            title={`${token0.metadata.name} Deposit Fee`}
                            value={`${fee0} ${token0.metadata.symbol}`}
                          />
                          <StackLine
                            title={`${token1.metadata.name} Deposit Fee`}
                            value={`${fee1} ${token1.metadata.symbol}`}
                          />
                        </Stack>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </HStack>
              </Flex>
            )}
          </>
        )}
      </Flex>
      {!isConnected ? (
        <PlugButton variant="dark" />
      ) : (
        <Button
          isFullWidth
          size="lg"
          variant="gradient"
          colorScheme="dark-blue"
          onClick={handleAddLiquidity}
          isDisabled={buttonDisabled}
          isLoading={isLoading}
        >
          {buttonMessage}
        </Button>
      )}
    </Stack>
  );
};
