import { Box } from '@chakra-ui/react';

import { InformationBox, Header, IncrementBox } from '@/components';
import { AssetStep, assetsViewActions, useAppDispatch } from '@/store';

import { SONIC_ASSETS_MOCK } from '../../mocks';

export const HomeStep = () => {
  const dispatch = useAppDispatch();

  const handleIncrement = (tokenName?: string) => {
    if (tokenName) {
      dispatch(assetsViewActions.setSelectedTokenName(tokenName));
      dispatch(assetsViewActions.setStep(AssetStep.Deposit));
    }
  };

  const handleDecrease = (tokenName?: string) => {
    if (tokenName) {
      dispatch(assetsViewActions.setSelectedTokenName(tokenName));
      dispatch(assetsViewActions.setStep(AssetStep.Withdraw));
    }
  };

  return (
    <>
      {/* TODO: Information */}
      {true && (
        <InformationBox title="Assets Details" mb="37px">
          <Box as="p" color="#888E8F">
            Assets description here
          </Box>
        </InformationBox>
      )}
      <Header title="Your Assets" />
      {SONIC_ASSETS_MOCK.map((asset) => (
        <Box mb={5} key={asset.name}>
          <IncrementBox
            title={asset.name}
            mainImgSrc={asset.logo}
            onIncrement={() => handleIncrement(asset?.name)}
            onDecreace={() => handleDecrease(asset?.name)}
          >
            {/* {asset.totalSupply && (
          <AssetContent price={asset.price} amount={asset.totalSupply} />
        )} */}
          </IncrementBox>
        </Box>
      ))}
    </>
  );
};
