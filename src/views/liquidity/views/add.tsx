import { useEffect, useMemo, useState } from 'react';
import { Text, Flex, Image, Box } from '@chakra-ui/react';

import {
  Button,
  PlugButton,
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

import { plusSrc, equalSrc } from '@/assets';
import {
  FeatureState,
  INITIAL_LIQUIDITY_SLIPPAGE,
  liquidityViewActions,
  NotificationType,
  useAppDispatch,
  useLiquidityViewStore,
  useNotificationStore,
  usePlugStore,
  useSwapCanisterStore,
  useTokenModalOpener,
} from '@/store';
import { useNavigate } from 'react-router';
import { useQuery } from '@/hooks/use-query';
import { SwapIDL } from '@/did';
import { getAppAssetsSources } from '@/config/utils';
import { SlippageSettings } from '@/components';
import { useBalances } from '@/hooks/use-balances';
import { getCurrencyString, getAmountEqualLPToken } from '@/utils/format';
import BigNumber from 'bignumber.js';

const BUTTON_TITLES = ['Review Supply', 'Confirm Supply'];

export const LiquidityAdd = () => {
  const query = useQuery();

  const { isConnected } = usePlugStore();
  const { allPairs } = useSwapCanisterStore();

  const { addNotification } = useNotificationStore();
  const { token0, token1, slippage } = useLiquidityViewStore();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { tokenBalances, sonicBalances, totalBalances } = useBalances();
  const { supportedTokenListState, supportedTokenList } =
    useSwapCanisterStore();
  const openSelectTokenModal = useTokenModalOpener();

  const [isReviewing, setIsReviewing] = useState(false);
  const [autoSlippage, setAutoSlippage] = useState(true);

  useEffect(() => {
    if (supportedTokenListState !== FeatureState.Loading) {
      const toTokenId = query.get('tokenTo');
      const fromTokenId = query.get('tokenFrom');

      if (fromTokenId) {
        dispatch(
          liquidityViewActions.setValue({ data: 'token0', value: '0.00' })
        );
        dispatch(
          liquidityViewActions.setToken({
            data: 'token0',
            tokenId: fromTokenId,
          })
        );
      }

      if (toTokenId) {
        dispatch(
          liquidityViewActions.setValue({ data: 'token1', value: '0.00' })
        );
        dispatch(
          liquidityViewActions.setToken({ data: 'token1', tokenId: toTokenId })
        );
      }
    }
  }, [supportedTokenListState]);

  const handlePreviousStep = () => {
    if (isReviewing) {
      setIsReviewing(false);
    } else {
      navigate('/liquidity');
    }
  };

  const getActiveStatus = (token?: SwapIDL.TokenInfoExt, value?: string) => {
    const shouldBeActive = token && value?.length && parseFloat(value) > 0;

    return shouldBeActive && !isReviewing ? 'active' : undefined;
  };

  const handleButtonClick = () => {
    if (!isReviewing) {
      setIsReviewing(true);
    }

    if (isReviewing) {
      // TODO: Add liqudity batch run
      addNotification({
        title: 'Liquidity Added',
        type: NotificationType.Success,
        id: Date.now().toString(),
      });
    }
  };

  const handleToken0MaxClick = () => {
    const value =
      totalBalances && token0.token
        ? getCurrencyString(
            totalBalances[token0.token?.id],
            token0.token?.decimals
          )
        : '0.00';

    dispatch(liquidityViewActions.setValue({ data: 'token0', value }));
  };

  const handleToken1MaxClick = () => {
    const value =
      totalBalances && token1.token
        ? getCurrencyString(
            totalBalances[token1.token?.id],
            token1.token?.decimals
          )
        : '0.00';

    dispatch(liquidityViewActions.setValue({ data: 'token1', value }));
  };

  const handleToken0Select = () => {
    if (!isReviewing) {
      openSelectTokenModal({
        metadata: supportedTokenList,
        onSelect: (tokenId) =>
          dispatch(liquidityViewActions.setToken({ data: 'token0', tokenId })),
        selectedTokenIds,
      });
    }
  };

  const handleToken1Select = () => {
    if (!isReviewing) {
      openSelectTokenModal({
        metadata: supportedTokenList,
        onSelect: (tokenId) =>
          dispatch(liquidityViewActions.setToken({ data: 'token1', tokenId })),
        selectedTokenIds,
      });
    }
  };

  const handleSetToken0Value = (value: string) => {
    dispatch(liquidityViewActions.setValue({ data: 'token0', value }));
    const lpValue = getLPValue(value);

    if (lpValue) {
      dispatch(
        liquidityViewActions.setValue({
          data: 'token1',
          value: lpValue,
        })
      );
    }
  };

  const handleSetToken1Value = (value: string) => {
    dispatch(liquidityViewActions.setValue({ data: 'token1', value }));
    const lpValue = getLPValue(value);

    if (lpValue) {
      dispatch(
        liquidityViewActions.setValue({
          data: 'token0',
          value: lpValue,
        })
      );
    }
  };

  // Utils

  const getLPValue = (value: string) => {
    if (
      token0.token &&
      token1.token &&
      allPairs?.[token0.token.id]?.[token1.token.id]
    ) {
      return getAmountEqualLPToken({
        amountIn: value,
        reserveIn: String(pairData?.reserve0),
        reserveOut: String(pairData?.reserve1),
        decimalsOut: token0.token?.decimals,
      });
    }
  };

  // Memorized values

  const shouldButtonBeActive = useMemo(() => {
    if (!token0.token || !token1.token) return false;
    if (isReviewing) return true;

    const fromTokenCondition =
      getActiveStatus(token0.token, token0.value) === 'active';
    const toTokenCondition =
      getActiveStatus(token1.token, token1.value) === 'active';

    return fromTokenCondition && toTokenCondition;
  }, [token0, token1, isReviewing]);

  const buttonTitle = BUTTON_TITLES[isReviewing ? 1 : 0];

  const selectedTokenIds = useMemo(() => {
    let selectedIds = [];
    if (token0?.token?.id) selectedIds.push(token0.token.id);
    if (token1?.token?.id) selectedIds.push(token1.token.id);

    return selectedIds;
  }, [token0?.token?.id, token1?.token?.id]);

  const pairData = useMemo(() => {
    if (allPairs && token0.token && token1.token) {
      return allPairs[token0.token.id][token1.token.id];
    }
    return undefined;
  }, [allPairs, token0.token, token1.token]);

  const token1Price = useMemo(() => {
    if (pairData && pairData.reserve0 && pairData.reserve0 && token1.token) {
      return new BigNumber(String(pairData.reserve0))
        .div(new BigNumber(String(pairData.reserve1)))
        .dp(Number(token1.token.decimals));
    }
    return '1';
  }, [pairData, token1.token]);

  return (
    <>
      <TitleBox
        onArrowBack={handlePreviousStep}
        title="Add Liquidity"
        settings={
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
        }
      />
      <Flex mt={5} direction="column" alignItems="center">
        <Box width="100%">
          <Token
            value={token0.value}
            setValue={handleSetToken0Value}
            tokenListMetadata={supportedTokenList}
            tokenMetadata={token0.token}
            isDisabled={isReviewing}
            price={0}
            sources={getAppAssetsSources({
              balances: {
                plug:
                  token0.token && tokenBalances
                    ? tokenBalances[token0.token.id]
                    : 0,
                sonic:
                  token0.token && sonicBalances
                    ? sonicBalances[token0.token.id]
                    : 0,
              },
            })}
            isLoading={supportedTokenListState === FeatureState.Loading}
          >
            <TokenContent>
              <TokenDetails onClick={handleToken0Select}>
                <TokenDetailsLogo />
                <TokenDetailsSymbol />
              </TokenDetails>

              <TokenInput />
            </TokenContent>
            <TokenBalances>
              <TokenBalancesDetails onMaxClick={handleToken0MaxClick} />
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
            setValue={handleSetToken1Value}
            tokenListMetadata={supportedTokenList}
            tokenMetadata={token1.token}
            isDisabled={isReviewing}
            price={0}
            sources={getAppAssetsSources({
              balances: {
                plug:
                  token1.token && tokenBalances
                    ? tokenBalances[token1.token.id]
                    : 0,
                sonic:
                  token1.token && sonicBalances
                    ? sonicBalances[token1.token.id]
                    : 0,
              },
            })}
            isLoading={supportedTokenListState === FeatureState.Loading}
          >
            <TokenContent>
              <TokenDetails onClick={handleToken1Select}>
                <TokenDetailsLogo />
                <TokenDetailsSymbol />
              </TokenDetails>

              <TokenInput />
            </TokenContent>
            <TokenBalances>
              <TokenBalancesDetails onMaxClick={handleToken1MaxClick} />
              <TokenBalancesPrice />
            </TokenBalances>
          </Token>
        </Box>

        {isReviewing && (
          <>
            <Flex
              direction="column"
              alignItems="center"
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
              <Image m="auto" src={equalSrc} />
            </Flex>
            <Box width="100%">
              <Token value={token1.value} price={0} isDisabled shouldGlow>
                <TokenContent>
                  <TokenDetails>
                    <TokenDetailsLogo />
                    <TokenDetailsSymbol />
                  </TokenDetails>

                  <TokenInput />
                </TokenContent>
                <TokenBalances>
                  <Text>Share of pool:</Text>

                  <Text>SHARE HERE</Text>
                </TokenBalances>
              </Token>
            </Box>
          </>
        )}
        <Flex
          direction="row"
          justifyContent="space-between"
          width="100%"
          my={2.5}
          px={5}
        >
          <Text color="#888E8F">{`${token0.token?.symbol} + ${token1.token?.symbol}`}</Text>
          <Text color="#888E8F">{`1 ${token0.token?.symbol} = ${token1Price} ${token1.token?.symbol}`}</Text>
        </Flex>
      </Flex>

      {!isConnected ? (
        <PlugButton />
      ) : (
        <Button
          isFullWidth
          size="lg"
          onClick={handleButtonClick}
          isDisabled={!shouldButtonBeActive}
          isLoading={supportedTokenListState === FeatureState.Loading}
        >
          {buttonTitle}
        </Button>
      )}
    </>
  );
};
