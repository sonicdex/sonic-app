import {
  useDisclosure,
  HStack,
  Text,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  Stack,
} from '@chakra-ui/react';

import {
  InformationBox,
  Header,
  Asset,
  AssetImageBlock,
  AssetTitleBlock,
  AssetIconButton,
  PlugButton,
} from '@/components';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { DefaultTokensImage } from '@/constants';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { RemoveLiquidityModal } from '../components/remove-liquidity-modal';
import { FeatureState, usePlugStore, useSwapCanisterStore } from '@/store';

import { TokenMetadata } from '@/models';
import { getCurrencyString } from '@/utils/format';

const INFORMATION_TITLE = 'Liquidity Provider Rewards';
const INFORMATION_DESCRIPTION =
  'Liquidity providers earn a 0.25% fee on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity. If you want to learn ';

const InformationDescription = () => (
  <Text color="#888E8F">
    {INFORMATION_DESCRIPTION}
    <Box
      as="a"
      color="#888E8F"
      href="#"
      textDecoration="underline"
      _visited={{
        color: '#888E8F',
      }}
    >
      review our blog post
    </Box>
    .
  </Text>
);

type PairedUserLPToken = {
  token0: TokenMetadata;
  token1: TokenMetadata;
  balance: string;
};

export const Liquidity = () => {
  const navigate = useNavigate();
  const removeLiquidityModal = useDisclosure();
  const [displayInformation, setDisplayInformation] = useState(true);
  const { isConnected } = usePlugStore();
  const {
    userLPBalances,
    userLPBalancesState,
    supportedTokenList,
    supportedTokenListState,
  } = useSwapCanisterStore();

  const moveToAddLiquidityView = (tokenFrom?: string, tokenTo?: string) => {
    const query =
      tokenFrom || tokenTo
        ? `?${tokenFrom ? `token0=${tokenFrom}` : ''}${
            tokenTo ? `&token1=${tokenTo}` : ''
          }`
        : '';

    navigate(`/liquidity/add${query}`);
  };

  const handleInformationClose = () => {
    setDisplayInformation(false);
  };

  const isLoading = useMemo(() => {
    if (
      (supportedTokenListState === FeatureState.Loading,
      userLPBalancesState === FeatureState.Loading)
    ) {
      return true;
    }

    return false;
  }, [supportedTokenListState, userLPBalancesState]);

  const pairedUserLPTokens = useMemo(() => {
    if (!isLoading && userLPBalances && supportedTokenList) {
      const lpBalancesPairIDs = Object.keys(userLPBalances);

      return lpBalancesPairIDs.reduce((acc, pairTokenIds) => {
        const [tokenId0, tokenId1] = pairTokenIds.split(':') as [
          string,
          string
        ];

        const token0 = supportedTokenList.find(
          (token) => token.id === tokenId0
        );
        const token1 = supportedTokenList.find(
          (token) => token.id === tokenId1
        );

        return [
          ...acc,
          {
            token0,
            token1,
            balance: getCurrencyString(
              userLPBalances[pairTokenIds],
              token0?.decimals
            ),
          } as PairedUserLPToken,
        ];
      }, [] as PairedUserLPToken[]);
    }
  }, [isLoading, userLPBalances, supportedTokenList]);

  return (
    <>
      <RemoveLiquidityModal {...removeLiquidityModal} />
      {displayInformation && (
        <InformationBox
          onClose={handleInformationClose}
          title={INFORMATION_TITLE}
          mb={9}
        >
          <InformationDescription />
        </InformationBox>
      )}
      <Header
        title="Your Liquidity Positions"
        buttonText="Create Position"
        onButtonClick={moveToAddLiquidityView}
      />

      {!isConnected ? (
        <>
          <Alert status="warning" mb={6}>
            <AlertIcon />
            <AlertTitle>You are not connected to the wallet</AlertTitle>
          </Alert>

          <PlugButton />
        </>
      ) : isLoading ? (
        <Stack spacing={4}>
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
        </Stack>
      ) : !pairedUserLPTokens?.length ? (
        <Text textAlign="center" color="gray.400">
          You have no liquidity positions
        </Text>
      ) : (
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
          {pairedUserLPTokens.map(({ token0, token1, balance }, index) => {
            if (!token0.id || !token1.id) {
              return null;
            }

            return (
              <Asset
                key={index}
                type="lp"
                imageSources={[
                  DefaultTokensImage[token0.id],
                  DefaultTokensImage[token1.id],
                ]}
              >
                <HStack spacing={4}>
                  <AssetImageBlock />
                  <AssetTitleBlock
                    title={`${token0.symbol}/${token1.symbol}`}
                  />
                </HStack>
                <Box>
                  <Text fontWeight="bold" color="gray.400">
                    LP Tokens
                  </Text>
                  <Text fontWeight="bold">{balance}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" color="gray.400">
                    Fees Earned
                  </Text>
                  <Text fontWeight="bold" color="green.400">
                    ~$231.21
                  </Text>
                </Box>

                <HStack>
                  <AssetIconButton
                    aria-label="Remove liquidity"
                    icon={<FaMinus />}
                    onClick={removeLiquidityModal.onOpen}
                  />
                  <AssetIconButton
                    aria-label="Add liquidity"
                    colorScheme="dark-blue"
                    icon={<FaPlus />}
                    onClick={() => moveToAddLiquidityView(token0.id, token1.id)}
                  />
                </HStack>
              </Asset>
            );
          })}
        </Stack>
      )}
    </>
  );
};
