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
  const { token0: from, token1: to } = useLiquidityViewStore();
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
    if (!from.token || !to.token) return false;
    if (subStep === 1) return true;

    const fromTokenCondition =
      getActiveStatus(from.token, from.value) === 'active';
    const toTokenCondition = getActiveStatus(to.token, to.value) === 'active';

    return fromTokenCondition && toTokenCondition;
  }, [from, to, subStep]);

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
    if (from?.token?.id) selectedIds.push(from.token.id);
    if (to?.token?.id) selectedIds.push(to.token.id);

    return selectedIds;
  }, [from?.token?.id, to?.token?.id]);

  useEffect(() => {
    if (supportedTokenListState !== FeatureState.Loading) {
      const toTokenId = query.get('tokenTo');
      const fromTokenId = query.get('tokenFrom');

      if (fromTokenId) {
        dispatch(
          liquidityViewActions.setValue({ data: 'from', value: '0.00' })
        );
        dispatch(
          liquidityViewActions.setToken({ data: 'from', tokenId: fromTokenId })
        );
      }

      if (toTokenId) {
        dispatch(liquidityViewActions.setValue({ data: 'to', value: '0.00' }));
        dispatch(
          liquidityViewActions.setToken({ data: 'to', tokenId: toTokenId })
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
            value={from.value}
            setValue={(value) =>
              dispatch(liquidityViewActions.setValue({ data: 'from', value }))
            }
            onTokenSelect={(tokenId) => {
              dispatch(
                liquidityViewActions.setToken({ data: 'from', tokenId })
              );
            }}
            otherTokensMetadata={supportedTokenList}
            selectedTokenMetadata={from.token}
            status={getActiveStatus(from.token, from.value)}
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
            value={to.value}
            setValue={(value) =>
              dispatch(liquidityViewActions.setValue({ data: 'to', value }))
            }
            onTokenSelect={(tokenId) => {
              dispatch(liquidityViewActions.setToken({ data: 'to', tokenId }));
            }}
            otherTokensMetadata={supportedTokenList}
            selectedTokenMetadata={to.token}
            status={getActiveStatus(to.token, to.value)}
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
                value={to.value}
                setValue={(value) =>
                  dispatch(liquidityViewActions.setValue({ data: 'to', value }))
                }
                onTokenSelect={(tokenId) => {
                  dispatch(
                    liquidityViewActions.setToken({ data: 'to', tokenId })
                  );
                }}
                otherTokensMetadata={supportedTokenList}
                selectedTokenMetadata={to.token}
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
