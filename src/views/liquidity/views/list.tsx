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
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ENV } from '@/config';
import { RemoveLiquidityModal } from '../components/remove-liquidity-modal';
import { FeatureState, usePlugStore, useSwapStore } from '@/store';

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

export const Liquidity = () => {
  const navigate = useNavigate();
  const removeLiquidityModal = useDisclosure();
  const [displayInformation, setDisplayInformation] = useState(true);
  const { isConnected } = usePlugStore();
  const { userLPBalances, userLPBalancesState } = useSwapStore();

  const moveToAddLiquidityView = (tokenFrom?: string, tokenTo?: string) => {
    const query =
      tokenFrom || tokenTo
        ? `?${tokenFrom ? `tokenFrom=${tokenFrom}` : ''}${
            tokenTo ? `&tokenTo=${tokenTo}` : ''
          }`
        : '';

    navigate(`/liquidity/add${query}`);
  };

  const handleInformationClose = () => {
    setDisplayInformation(false);
  };

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
      ) : userLPBalancesState === FeatureState.Loading ? (
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
      ) : !userLPBalances?.length ? (
        <Text textAlign="center" color="gray.400">
          You have no liquidity positions
        </Text>
      ) : (
        <>
          {(userLPBalances as unknown as any[]).map((_, index) => (
            <Asset
              key={index}
              type="lp"
              imageSources={[
                DefaultTokensImage['XTC'],
                DefaultTokensImage['WICP'],
              ]}
            >
              <HStack spacing={4}>
                <AssetImageBlock />
                <AssetTitleBlock title="XTC/WICP" />
              </HStack>
              <Box>
                <Text fontWeight="bold" color="gray.400">
                  LP Tokens
                </Text>
                <Text fontWeight="bold">6.7821</Text>
              </Box>

              <Box>
                <Text fontWeight="bold" color="gray.400">
                  Fees Earned
                </Text>
                <Text fontWeight="bold" color="green.400">
                  $231.21
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
                  onClick={() =>
                    moveToAddLiquidityView(
                      ENV.canisterIds.XTC,
                      ENV.canisterIds.WICP
                    )
                  }
                />
              </HStack>
            </Asset>
          ))}
        </>
      )}
    </>
  );
};
