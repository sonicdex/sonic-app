import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuList,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
import { FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router';

import { plusSrc } from '@/assets';
import {
  LPImageBlock,
  PlugButton,
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
import { SlippageSettings } from '@/components';
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
    const amountIn =
      value ?? (dataKey === 'token0' ? token0.value : token1.value);

    const reserveIn = String(
      dataKey === 'token0' ? pairData?.reserve0 : pairData?.reserve1
    );
    const reserveOut = String(
      dataKey === 'token1' ? pairData?.reserve0 : pairData?.reserve1
    );

    dispatch(liquidityViewActions.setValue({ data: dataKey, value: amountIn }));

    if (
      token0.metadata &&
      token1.metadata &&
      allPairs?.[token0.metadata.id]?.[token1.metadata.id]
    ) {
      const decimalsOut =
        dataKey === 'token0'
          ? token1.metadata?.decimals
          : token0.metadata?.decimals;

      const lpValue = getAmountEqualLPToken({
        amountIn,
        reserveIn,
        reserveOut,
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
    if (!token0.metadata || !token1.metadata) return [true, 'Select tokens'];

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

      if (parsedToken1Balance > parsedToken1Balance) {
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

  const pairData = useMemo(() => {
    if (allPairs && token0.metadata && token1.metadata) {
      return allPairs?.[token0.metadata.id]?.[token1.metadata.id];
    }
    return undefined;
  }, [allPairs, token0.metadata, token1.metadata]);

  const liquidityAmounts = useMemo(() => {
    if (
      Number(token0.value) &&
      Number(token1.value) &&
      token0.metadata?.decimals &&
      token1.metadata?.decimals
    ) {
      if (pair) {
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

        const value = getAmountLP(getAmountLPOptions);
        const percentage = getLPPercentageString(getPercentageLPOptions);

        return { value, percentage };
      }

      if (!pair) {
        return {
          value: new BigNumber(token0.value)
            .plus(new BigNumber(token1.value))
            .div(2)
            .toFixed(3),
          percentage: '100%',
        };
      }
    }

    return { value: '0.00', percentage: '0%' };
  }, [token0, token1, pair]);

  const shouldShowSumUp = useMemo(() => {
    if (Number(token0.value) > 0 && Number(token1.value) > 0) {
      return true;
    }

    return false;
  }, [token0.value, token1.value]);

  const { token0Price, token1Price } = useMemo(() => {
    if (token0.metadata && token1.metadata) {
      if (pairData && pairData.reserve0 && pairData.reserve1) {
        const token0Price = new BigNumber(String(pairData.reserve0))
          .div(new BigNumber(String(pairData.reserve1)))
          .dp(Number(token0.metadata.decimals))
          .toFixed(3);

        const token1Price = new BigNumber(String(pairData.reserve1))
          .div(new BigNumber(String(pairData.reserve0)))
          .dp(Number(token1.metadata.decimals))
          .toFixed(3);

        return {
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

        return {
          token0Price:
            !token0Value ||
            new BigNumber(token0Value).isNaN() ||
            !new BigNumber(token0Value).isFinite()
              ? '0.00'
              : token0Value,
          token1Price:
            !token1Value ||
            new BigNumber(token1Value).isNaN() ||
            !new BigNumber(token1Value).isFinite()
              ? '0.00'
              : token1Value,
        };
      }
    }

    return {
      token0Price: '0.00',
      token1Price: '0.00',
    };
  }, [token0, token1, pairData]);

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
      if (token1Id) {
        const token0 = supportedTokenList.find(({ id }) => id === token0Id);
        dispatch(
          liquidityViewActions.setToken({
            data: 'token0',
            token: token0,
          })
        );
        dispatch(liquidityViewActions.setValue({ data: 'token0', value: '' }));
      }

      const token0Id = query.get('token0');
      if (token0Id) {
        const token1 = supportedTokenList.find(({ id }) => id === token1Id);
        dispatch(
          liquidityViewActions.setToken({ data: 'token1', token: token1 })
        );
        dispatch(liquidityViewActions.setValue({ data: 'token1', value: '' }));
      }
    }
  }, [isLoading]);

  return (
    <>
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
      <Flex my={5} direction="column" alignItems="center">
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
          borderRadius={4}
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
          <Image m="auto" src={plusSrc} />
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
        {shouldShowSumUp && (
          <>
            <Stack
              direction="row"
              alignItems="center"
              pl={3}
              pr={5}
              py={2}
              borderRadius="full"
              w="fit-content"
              mt={-3}
              mb={-3}
              zIndex={1200}
              bg={isReviewing ? '#3D52F4' : '#1E1E1E'}
              border={`1px solid ${isReviewing ? '#3D52F4' : '#373737'}`}
            >
              <LPImageBlock
                size="sm"
                imageSources={[token0.metadata?.logo, token1.metadata?.logo]}
              />

              <Text fontWeight="bold">
                {token0.metadata?.symbol} - {token1.metadata?.symbol}
              </Text>
            </Stack>

            <Box width="100%">
              <Token value={token1.value} isDisabled shouldGlow={isReviewing}>
                <SimpleGrid columns={3}>
                  <Box>
                    <Text color="gray.300">Share of pool:</Text>
                    <Text>
                      {liquidityAmounts.value} ({liquidityAmounts.percentage})
                    </Text>
                  </Box>
                  <Box textAlign="center">
                    <Text color="gray.300">
                      {token1.metadata?.symbol} per {token0.metadata?.symbol}
                    </Text>
                    <Text>{token0Price}</Text>
                  </Box>
                  <Box textAlign="right">
                    <Text color="gray.300">
                      {token0.metadata?.symbol} per {token1.metadata?.symbol}
                    </Text>
                    <Text>{token1Price}</Text>
                  </Box>
                </SimpleGrid>
              </Token>
            </Box>
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
    </>
  );
};
