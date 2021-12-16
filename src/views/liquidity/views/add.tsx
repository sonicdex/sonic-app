import { useEffect, useMemo, useState } from 'react';
import { Text, Flex, Image, Box } from '@chakra-ui/react';

import { Button, PlugButton, TitleBox, TokenBox } from '@/components';

import { plusSrc, equalSrc } from '@/assets';
import {
  FeatureState,
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

const BUTTON_TITLES = ['Review Supply', 'Confirm Supply'];

export const LiquidityAdd = () => {
  const query = useQuery();

  const { isConnected } = usePlugStore();

  const { addNotification } = useNotificationStore();
  const { token0, token1 } = useLiquidityViewStore();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { supportedTokenListState, supportedTokenList } = useSwapStore();

  const [subStep, setSubStep] = useState(0);

  const handlePreviousStep = () => {
    if (subStep === 0) {
      navigate('/liquidity');
    } else {
      setSubStep(subStep - 1);
    }
  };

  const getActiveStatus = (token?: SwapIDL.TokenInfoExt, value?: string) => {
    const shouldBeActive = token && value?.length && parseFloat(value) > 0;

    return shouldBeActive && subStep !== 1 ? 'active' : undefined;
  };

  const shouldButtonBeActive = useMemo(() => {
    if (!token0.token || !token1.token) return false;
    if (subStep === 1) return true;

    const fromTokenCondition =
      getActiveStatus(token0.token, token0.value) === 'active';
    const toTokenCondition =
      getActiveStatus(token1.token, token1.value) === 'active';

    return fromTokenCondition && toTokenCondition;
  }, [token0, token1, subStep]);

  const buttonTitle = BUTTON_TITLES[subStep];

  const handleButtonClick = () => {
    switch (subStep) {
      case 0:
        setSubStep(1);
        break;
      case 1:
        addNotification({
          title: 'Liquidity Added',
          type: NotificationType.Done,
          id: Date.now().toString(),
        });
        break;
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

  return (
    <>
      <TitleBox
        onArrowBack={handlePreviousStep}
        title="Add Liquidity"
        settings={true}
      />
      <Flex mt={5} direction="column" alignItems="center">
        <Box width="100%">
          <TokenBox
            value={token0.value}
            setValue={(value) =>
              dispatch(liquidityViewActions.setValue({ data: 'token0', value }))
            }
            onTokenSelect={(tokenId) => {
              dispatch(
                liquidityViewActions.setToken({ data: 'token0', tokenId })
              );
            }}
            otherTokensMetadata={supportedTokenList}
            selectedTokenMetadata={token0.token}
            status={getActiveStatus(token0.token, token0.value)}
            selectedTokenIds={selectedTokenIds}
            disabled={subStep === 1}
            menuDisabled={subStep === 1}
            price={0}
            sources={getAppAssetsSources({ balances: { plug: 0, sonic: 0 } })}
            isLoading={supportedTokenListState === FeatureState.Loading}
          />
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
          <TokenBox
            value={token1.value}
            setValue={(value) =>
              dispatch(liquidityViewActions.setValue({ data: 'token1', value }))
            }
            onTokenSelect={(tokenId) => {
              dispatch(
                liquidityViewActions.setToken({ data: 'token1', tokenId })
              );
            }}
            otherTokensMetadata={supportedTokenList}
            selectedTokenMetadata={token1.token}
            status={getActiveStatus(token1.token, token1.value)}
            disabled={subStep === 1}
            menuDisabled={subStep === 1}
            price={0}
            sources={getAppAssetsSources({ balances: { plug: 0, sonic: 0 } })}
            isLoading={supportedTokenListState === FeatureState.Loading}
          />
        </Box>
        {subStep === 1 && (
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
              mt={-4}
              mb={-6}
              zIndex={1200}
            >
              <Image m="auto" src={equalSrc} />
            </Flex>
            <Box mt={2.5} width="100%">
              <TokenBox
                value={token1.value}
                setValue={(value) =>
                  dispatch(
                    liquidityViewActions.setValue({ data: 'token1', value })
                  )
                }
                onTokenSelect={(tokenId) => {
                  dispatch(
                    liquidityViewActions.setToken({ data: 'token1', tokenId })
                  );
                }}
                otherTokensMetadata={supportedTokenList}
                selectedTokenMetadata={token1.token}
                status="active"
                price={0}
                sources={getAppAssetsSources({
                  balances: { plug: 0, sonic: 0 },
                })}
                balanceText="Share of pool:"
                priceText="SHARE HERE"
                disabled
                menuDisabled
                glow
              />
            </Box>
            <Flex
              direction="row"
              justifyContent="space-between"
              width="100%"
              my={2.5}
              px={5}
            >
              <Text color="#888E8F">{`${'fromToken'} + ${'toToken'}`}</Text>
              <Text color="#888E8F">{`1 ${'fromToken'} = 0.23 ${'toToken'}`}</Text>
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
