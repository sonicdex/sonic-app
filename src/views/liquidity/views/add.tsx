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
  useSwapStore,
} from '@/store';
import { useNavigate } from 'react-router';
import { useQuery } from '@/hooks/use-query';
import { SwapIDL } from '@/did';
import { getAppAssetsSources } from '@/config/utils';
import { SlippageSettings } from '@/components';
import { useBalances } from '@/hooks/use-balances';

const BUTTON_TITLES = ['Review Supply', 'Confirm Supply'];

export const LiquidityAdd = () => {
  const query = useQuery();

  const { isConnected } = usePlugStore();

  const { addNotification } = useNotificationStore();
  const { token0, token1, slippage } = useLiquidityViewStore();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { tokenBalances, sonicBalances } = useBalances();
  const { supportedTokenListState, supportedTokenList } = useSwapStore();

  const [isReviewing, setIsReviewing] = useState(false);
  const [autoSlippage, setAutoSlippage] = useState(true);

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

  const selectedTokenIds = useMemo(() => {
    let selectedIds = [];
    if (token0?.token?.id) selectedIds.push(token0.token.id);
    if (token1?.token?.id) selectedIds.push(token1.token.id);

    return selectedIds;
  }, [token0?.token?.id, token1?.token?.id]);

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

  const handleMaxClick = () => {
    dispatch(
      withdrawViewActions.setAmount(
        getCurrencyString(tokenBalance, token0.token?.decimals)
      )
    );
  };

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
            setValue={(value) =>
              dispatch(liquidityViewActions.setValue({ data: 'token0', value }))
            }
            onTokenSelect={(tokenId) => {
              dispatch(
                liquidityViewActions.setToken({ data: 'token0', tokenId })
              );
            }}
            tokenListMetadata={supportedTokenList}
            tokenMetadata={token0.token}
            isDisabled={!shouldButtonBeActive || isReviewing}
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
              <TokenDetails>
                <TokenDetailsLogo />
                <TokenDetailsSymbol />
              </TokenDetails>

              <TokenBalances>
                <TokenBalancesDetails onMaxClick={handleMaxClick} />
                <TokenBalancesPrice />
              </TokenBalances>

              <TokenInput />
            </TokenContent>
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
          mt={-4}
          mb={-6}
          zIndex={1200}
        >
          <Image m="auto" src={plusSrc} />
        </Box>
        <Box mt={2.5} mb={5} width="100%">
          <Token
            value={token1.value}
            setValue={(value) =>
              dispatch(liquidityViewActions.setValue({ data: 'token1', value }))
            }
            onTokenSelect={(tokenId) => {
              dispatch(
                liquidityViewActions.setToken({ data: 'token1', tokenId })
              );
            }}
            tokenListMetadata={supportedTokenList}
            tokenMetadata={token1.token}
            isDisabled={!shouldButtonBeActive || isReviewing}
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
              <TokenDetails>
                <TokenDetailsLogo />
                <TokenDetailsSymbol />
              </TokenDetails>

              <TokenBalances>
                <TokenBalancesDetails onMaxClick={handleMaxClick} />
                <TokenBalancesPrice />
              </TokenBalances>

              <TokenInput />
            </TokenContent>
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
              mt={-8}
              mb={-6}
              zIndex={1200}
            >
              <Image m="auto" src={equalSrc} />
            </Flex>
            <Box mt={2.5} width="100%">
              <Token value={token1.value} price={0} isDisabled shouldGlow>
                <TokenContent>
                  <TokenDetails>
                    <TokenDetailsLogo />
                    <TokenDetailsSymbol />
                  </TokenDetails>

                  <TokenBalances>
                    <Text>Share of pool:</Text>

                    <Text>SHARE HERE</Text>
                  </TokenBalances>

                  <TokenInput />
                </TokenContent>
              </Token>
            </Box>
            <Flex
              direction="row"
              justifyContent="space-between"
              width="100%"
              my={2.5}
              px={5}
            >
              <Text color="#888E8F">{`${token0.value} + ${token1.value}`}</Text>
              <Text color="#888E8F">{`1 ${token0.value} = 0.23 ${token1.value}`}</Text>
            </Flex>
          </>
        )}
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
