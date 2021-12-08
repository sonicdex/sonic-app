import { HStack, Text, Box } from '@chakra-ui/react';

import {
  InformationBox,
  Header,
  Asset,
  AssetImageBlock,
  AssetTitleBlock,
  AssetIconButton,
} from '@/components';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { DefaultTokensImage } from '@/constants';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ENV } from '@/config';

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
  const [displayInformation, setDisplayInformation] = useState(true);

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
    <div>
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
      {/* TODO: Replace mocks */}

      {/* <Text mt={9} color="#888E8F" textAlign="center" fontWeight={700}>
      You have no liquidity positions
    </Text> */}
      <Asset
        type="lp"
        imageSources={[DefaultTokensImage['XTC'], DefaultTokensImage['WICP']]}
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
            6.7821
          </Text>
        </Box>

        <HStack>
          <AssetIconButton aria-label="Remove liquidity" icon={<FaMinus />} />
          <AssetIconButton
            aria-label="Add liquidity"
            colorScheme="dark-blue"
            icon={<FaPlus />}
            onClick={() =>
              moveToAddLiquidityView(ENV.canisterIds.XTC, ENV.canisterIds.WICP)
            }
          />
        </HStack>
      </Asset>
    </div>
  );
};
