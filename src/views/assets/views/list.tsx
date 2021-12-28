import { useNavigate } from 'react-router';
import {
  Alert,
  AlertTitle,
  AlertIcon,
  // AlertDescription,
  Stack,
  Box,
  HStack,
  Text,
} from '@chakra-ui/react';

import {
  Asset,
  AssetIconButton,
  AssetImageBlock,
  AssetTitleBlock,
  DisplayCurrency,
  Header,
  InformationBox,
  PlugButton,
} from '@/components';
import {
  assetsViewActions,
  FeatureState,
  useAppDispatch,
  useAssetsViewStore,
  usePlugStore,
  useSwapCanisterStore,
} from '@/store';

import { theme } from '@/theme';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { useBalances } from '@/hooks/use-balances';
import { useMemo } from 'react';

export const Assets = () => {
  const dispatch = useAppDispatch();
  const { isBannerOpened } = useAssetsViewStore();
  const { totalBalances } = useBalances();
  const { supportedTokenListState, balancesState, supportedTokenList } =
    useSwapCanisterStore();
  const { isConnected } = usePlugStore();

  const navigate = useNavigate();

  const navigateToDeposit = (tokenId?: string) => {
    if (tokenId) {
      navigate(`/assets/deposit?tokenId=${tokenId}`);
    }
  };

  const navigateToWithdraw = (tokenId?: string) => {
    if (tokenId) {
      navigate(`/assets/withdraw?tokenId=${tokenId}`);
    }
  };

  const handleBannerClose = () => {
    dispatch(assetsViewActions.setIsBannerOpened(false));
  };

  const isSupportedTokenListPresent = useMemo(() => {
    return supportedTokenList && supportedTokenList.length > 0;
  }, [supportedTokenList]);

  const shouldShowSkeletons = useMemo(() => {
    return (
      supportedTokenListState === FeatureState.Loading ||
      balancesState === FeatureState.Loading
    );
  }, [supportedTokenListState, balancesState]);

  const shouldShowHeaderLoading = useMemo(() => {
    return (
      supportedTokenListState === FeatureState.Refreshing ||
      balancesState === FeatureState.Refreshing
    );
  }, [supportedTokenListState, balancesState]);

  return (
    <>
      {isBannerOpened && (
        <InformationBox
          title="Assets Details"
          mb={9}
          onClose={handleBannerClose}
        >
          <Text color="#888E8F">
            View all the assets you have deposited or obtained on Sonic through
            our Liquidity and Swaps protocols, and deposit more or withdraw them
            to your wallet.
          </Text>
        </InformationBox>
      )}

      <Header title="Your Assets" isLoading={shouldShowHeaderLoading} />

      {!isConnected ? (
        <>
          <Alert status="warning" mb={6}>
            <AlertIcon />
            <AlertTitle>You are not connected to the wallet</AlertTitle>
          </Alert>

          <PlugButton />
        </>
      ) : (
        <Box
          overflow="hidden"
          height="100%"
          display="flex"
          flexDirection="column"
          position="relative"
          _after={{
            content: "''",
            position: 'absolute',
            pointerEvents: 'none',
            height: 20,
            left: 0,
            right: 0,
            bottom: -1,
            background: `linear-gradient(to bottom, transparent 0%, ${theme.colors.bg} 100%)`,
          }}
        >
          <Stack
            css={{
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
            spacing={4}
            pb={8}
            overflow="auto"
          >
            {shouldShowSkeletons ? (
              <>
                <Asset isLoading>
                  <AssetImageBlock />
                  <HStack>
                    <AssetIconButton aria-label="Deposit" icon={<FaPlus />} />
                    <AssetIconButton aria-label="Withdraw" icon={<FaMinus />} />
                  </HStack>
                </Asset>

                <Asset isLoading>
                  <AssetImageBlock />
                  <HStack>
                    <AssetIconButton aria-label="Deposit" icon={<FaPlus />} />
                    <AssetIconButton aria-label="Withdraw" icon={<FaMinus />} />
                  </HStack>
                </Asset>

                <Asset isLoading>
                  <AssetImageBlock />
                  <HStack>
                    <AssetIconButton aria-label="Deposit" icon={<FaPlus />} />
                    <AssetIconButton aria-label="Withdraw" icon={<FaMinus />} />
                  </HStack>
                </Asset>
              </>
            ) : isSupportedTokenListPresent ? (
              supportedTokenList!.map(
                ({ id, name, symbol, decimals, price, logo }) => (
                  <Asset key={id} imageSources={[logo]}>
                    <HStack spacing={4}>
                      <AssetImageBlock />
                      <AssetTitleBlock title={symbol} subtitle={name} />
                    </HStack>

                    <Box>
                      <Text fontWeight="bold" color="gray.400">
                        Amount
                      </Text>
                      <DisplayCurrency
                        balance={totalBalances?.[id]}
                        decimals={decimals}
                        fontWeight="bold"
                      />
                    </Box>
                    {price && (
                      <Box>
                        <Text fontWeight="bold" color="gray.400">
                          Price
                        </Text>
                        <Text fontWeight="bold">{`$${price}`}</Text>
                      </Box>
                    )}

                    <HStack>
                      <AssetIconButton
                        aria-label={`Withdraw ${symbol}`}
                        icon={<FaMinus />}
                        onClick={() => navigateToWithdraw(id)}
                      />
                      <AssetIconButton
                        colorScheme="dark-blue"
                        aria-label={`Deposit ${symbol}`}
                        icon={<FaPlus />}
                        onClick={() => navigateToDeposit(id)}
                      />
                    </HStack>
                  </Asset>
                )
              )
            ) : null}
          </Stack>
        </Box>
      )}
    </>
  );
};
