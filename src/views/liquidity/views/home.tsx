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

  const moveToCreatePosition = () => {
    navigate('/liquidity/create-position');
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
        onButtonClick={moveToCreatePosition}
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
        <HStack>
          <AssetIconButton aria-label="Remove liquidity" icon={<FaMinus />} />
          <AssetIconButton
            aria-label="Add liquidity"
            colorScheme="dark-blue"
            icon={<FaPlus />}
          />
        </HStack>
      </Asset>
    </div>
  );
};
