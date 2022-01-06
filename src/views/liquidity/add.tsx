import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
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
} from '@chakra-ui/react';
import { FaCog } from '@react-icons/all-files/fa/FaCog';
import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { equalSrc, infoSrc, plusSrc } from '@/assets';
import {
  DisplayValue,
  LPImageBlock,
  PlugButton,
  SlippageSettings,
  StackLine,
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
  useSwapCanisterStore,
  useTokenModalOpener,
} from '@/store';
import {
  formatAmount,
  getAmountEqualLPToken,
  getAmountLP,
  getCurrencyString,
  getLPPercentageString,
} from '@/utils/format';
import { debounce } from '@/utils/function';

export const LiquidityAddView = () => {
  const query = useQuery();

  const { isConnected } = usePlugStore();
  const { allPairs } = useSwapCanisterStore();

  const { addNotification } = useNotificationStore();
  const { token0, token1, slippage, pair } = useLiquidityViewStore();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { tokenBalances, sonicBalances, totalBalances } = useBalances();
  const { supportedTokenList, supportedTokenListState, balancesState } =
    useSwapCanisterStore();
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
      title: `Adding liquidity: ${token0.metadata?.symbol} + ${token1.metadata?.symbol}`,
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

    const value =
      totalBalances && token.metadata
        ? getCurrencyString(
            tokenBalance - Number(token.metadata.fee),
            token.metadata?.decimals
          )
        : '';

    setTokenValueAndLPTokenValue(dataKey, value);
  };

  const handleSelectToken = (dataKey: LiquidityTokenDataKey) => {
    if (!isReviewing) {
      openSelectTokenModal({
        metadata: supportedTokenList,
        onSelect: (tokenId) => {
          if (tokenId && supportedTokenList) {
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

  const setTokenValueAndLPTokenValue = (
    dataKey: LiquidityTokenDataKey,
    value?: string
  ) => {
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

    dispatch(liquidityViewActions.setValue({ data: dataKey, value: amountIn }));

    if (
      token0.metadata &&
      token1.metadata &&
      allPairs?.[token0.metadata.id]?.[token1.metadata.id]
    ) {
      const lpValue = getAmountEqualLPToken({
        amountIn,
        reserveIn,
        reserveOut,
        decimalsIn,
        decimalsOut,
      });

      const reversedDataKey = dataKey === 'token0' ? 'token1' : 'token0';

      if (lpValue) {
        dispatch(
          liquidityViewActions.setValue({
            data: reversedDataKey,
            value: lpValue,
          })
        );
      }
    }
  };

  // Memorized values

  const token0Balance = useTokenBalanceMemo(token0.metadata?.id);
  const token1Balance = useTokenBalanceMemo(token1.metadata?.id);

  const isBalancesLoading = useMemo(
    () => balancesState === FeatureState.Loading,
    [token0Balance, token1Balance]
  );

  const isLoading = useMemo(() => {
    return supportedTokenListState === FeatureState.Loading;
  }, [supportedTokenListState]);

  const [buttonDisabled, buttonMessage] = useMemo<[boolean, string]>(() => {
    if (isLoading) return [true, 'Loading'];
    if (!token0.metadata || !token1.metadata) return [true, 'Select Tokens'];

    const parsedToken0Value = (token0.value && parseFloat(token0.value)) || 0;
    const parsedToken1Value = (token1.value && parseFloat(token1.value)) || 0;

    if (parsedToken0Value <= 0)
      return [true, `Enter ${token0.metadata.symbol} Amount`];

    if (parsedToken1Value <= 0)
      return [true, `Enter ${token1.metadata.symbol} Amount`];

    if (totalBalances && token0Balance && token1Balance) {
      const parsedToken0Balance = parseFloat(
        formatAmount(token0Balance, token0.metadata.decimals)
      );
      const parsedToken1Balance = parseFloat(
        formatAmount(token1Balance, token1.metadata.decimals)
      );

      if (parsedToken0Value > parsedToken0Balance) {
        return [true, `Insufficient ${token0.metadata.symbol} Balance`];
      }

      if (parsedToken1Value > parsedToken1Balance) {
        return [true, `Insufficient ${token1.metadata.symbol} Balance`];
      }
    }

    if (isReviewing) return [false, 'Confirm Supply'];
    return [false, 'Review Supply'];
  }, [isLoading, isReviewing, totalBalances, token0, token1]);

  const selectedTokenIds = useMemo(() => {
    const selectedIds = [];
    if (token0?.metadata?.id) selectedIds.push(token0.metadata.id);
    if (token1?.metadata?.id) selectedIds.push(token1.metadata.id);

    return selectedIds;
  }, [token0?.metadata?.id, token1?.metadata?.id]);

  const { token0Price, token1Price, liquidityPercentage, liquidityValue } =
    useMemo(() => {
      if (token0.metadata && token1.metadata) {
        if (pair && pair.reserve0 && pair.reserve1) {
          const token0Price = getAmountEqualLPToken({
            amountIn: '1',
            reserveIn: String(pair.reserve1),
            reserveOut: String(pair.reserve0),
            decimalsIn: Number(token1.metadata.decimals),
            decimalsOut: Number(token0.metadata.decimals),
          });

          const token1Price = getAmountEqualLPToken({
            amountIn: '1',
            reserveIn: String(pair.reserve0),
            reserveOut: String(pair.reserve1),
            decimalsIn: Number(token0.metadata.decimals),
            decimalsOut: Number(token1.metadata.decimals),
          });

          const getAmountLPOptions = {
            token0Amount: token0.value,
            token1Amount: token1.value,
            reserve0: String(pair.reserve0),
            reserve1: String(pair.reserve1),
            totalSupply: String(pair.totalSupply),
          };

          const getPercentageLPOptions = {
            ...getAmountLPOptions,
            token0Decimals: token0.metadata?.decimals,
            token1Decimals: token1.metadata?.decimals,
          };

          const liquidityValue = getAmountLP(getAmountLPOptions);
          const liquidityPercentage = getLPPercentageString(
            getPercentageLPOptions
          );

          return {
            liquidityValue,
            liquidityPercentage,
            token0Price,
            token1Price,
          };
        } else {
          const token0Value = new BigNumber(token1.value)
            .div(new BigNumber(token0.value))
            .dp(token0.metadata?.decimals)
            .toString();
          const token1Value = new BigNumber(token0.value)
            .div(new BigNumber(token1.value))
            .dp(token1.metadata?.decimals)
            .toString();

          const isToken0Price =
            !token0Value ||
            new BigNumber(token0Value).isNaN() ||
            !new BigNumber(token0Value).isFinite();

          const isToken1Price =
            !token1Value ||
            new BigNumber(token1Value).isNaN() ||
            !new BigNumber(token1Value).isFinite();

          return {
            token0Price: isToken0Price ? '0' : token0Value,
            token1Price: isToken1Price ? '0' : token1Value,
            liquidityPercentage: '100%',
            liquidityValue: new BigNumber(token0.value)
              .multipliedBy(new BigNumber(token1.value))
              .sqrt()
              .toString(),
          };
        }
      }

      return {
        token0Price: '0',
        token1Price: '0',
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
  }, [isLoading]);

  const { fee0, fee1 } = useMemo(() => {
    if (token0.metadata && token1.metadata) {
      const fee0 = getCurrencyString(
        token0.metadata.fee + token0.metadata.fee,
        token0.metadata.decimals
      );
      const fee1 = getCurrencyString(
        token1.metadata.fee + token1.metadata.fee,
        token1.metadata.decimals
      );

      return { fee0, fee1 };
    }

    return { fee0: '0', fee1: '0' };
  }, [token0.metadata, token1.metadata]);

  return (
    <Stack spacing={4}>
      <ViewHeader onArrowBack={handlePreviousStep} title="Add Liquidity">
        <Menu>
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
            bg="#1E1E1E"
            border="none"
            borderRadius={20}
            ml={-20}
            py={0}
          >
            <SlippageSettings
              slippage={slippage}
              setSlippage={(value) =>
                dispatch(liquidityViewActions.setSlippage(value))
              }
              isAutoSlippage={autoSlippage}
              setIsAutoSlippage={(value) => {
                setAutoSlippage(value);
                dispatch(
                  liquidityViewActions.setSlippage(INITIAL_LIQUIDITY_SLIPPAGE)
                );
              }}
            />
          </MenuList>
        </Menu>
      </ViewHeader>
      <Flex direction="column" alignItems="center">
        <Box width="100%">
          <Token
            value={token0.value}
            setValue={(value) => setTokenValueAndLPTokenValue('token0', value)}
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
            <TokenBalances>
              <TokenBalancesDetails
                onMaxClick={() => handleTokenMaxClick('token0')}
              />
              <TokenBalancesPrice />
            </TokenBalances>
          </Token>
        </Box>
        <Box
          borderRadius={12}
          width={10}
          height={10}
          border="1px solid #373737"
          py={3}
          px={3}
          bg="#1E1E1E"
          mt={-2}
          mb={-2}
          zIndex={1200}
        >
          <Image alt="plus" m="auto" src={plusSrc} />
        </Box>
        <Box width="100%">
          <Token
            value={token1.value}
            setValue={(value) => setTokenValueAndLPTokenValue('token1', value)}
            tokenListMetadata={supportedTokenList}
            tokenMetadata={token1.metadata}
            isDisabled={isReviewing}
            sources={token1Sources}
            isLoading={isLoading}
            isBalancesLoading={isBalancesLoading}
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
            <TokenBalances>
              <TokenBalancesDetails
                onMaxClick={() => handleTokenMaxClick('token1')}
              />
              <TokenBalancesPrice />
            </TokenBalances>
          </Token>
        </Box>
        {token0.metadata && token1.metadata && (
          <>
            {isReviewing && (
              <>
                <Flex
                  borderRadius={12}
                  width={10}
                  height={10}
                  border="1px solid #373737"
                  py={3}
                  px={3}
                  bg="#1E1E1E"
                  mt={-2}
                  mb={-2}
                  zIndex={1200}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Image alt="equal" m="auto" src={equalSrc} />
                </Flex>

                <Token value={liquidityValue} isDisabled shouldGlow>
                  <TokenContent>
                    <Flex
                      borderRadius="full"
                      mr={5}
                      minWidth="fit-content"
                      background="gray.800"
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
                          <Image alt="info" ml={2.5} width={4} src={infoSrc} />
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverBody>
                            This is your share of the LP pool represented as
                            tokens.
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Flex>

                    <TokenInput />
                  </TokenContent>
                  <TokenBalances color="#888E8F">
                    Share of Pool:
                    <Text flex={1} textAlign="right">
                      {liquidityPercentage}
                    </Text>
                  </TokenBalances>
                </Token>
              </>
            )}

            {liquidityValue && (
              <Flex
                alignItems="center"
                justifyContent="space-between"
                width="full"
                mt={5}
                px={5}
              >
                <Text color="gray.300">
                  {`1 ${token0.metadata?.symbol} = `}{' '}
                  <DisplayValue as="span" value={token1Price} />{' '}
                  {` ${token1.metadata?.symbol}`}
                </Text>
                <HStack>
                  <Text color="gray.300">
                    {`1 ${token1.metadata?.symbol} = `}{' '}
                    <DisplayValue as="span" value={token0Price} />{' '}
                    {`${token0.metadata?.symbol}`}
                  </Text>
                  <Popover trigger="hover">
                    <PopoverTrigger>
                      <Image
                        alt="info"
                        src={infoSrc}
                        width={5}
                        transition="opacity 200ms"
                      />
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
        <PlugButton />
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
