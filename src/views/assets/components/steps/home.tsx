import { Text } from '@chakra-ui/react';

import { InformationBox, Header, Asset } from '@/components';
import { AssetStep, assetsViewActions, useAppDispatch } from '@/store';

import { SONIC_ASSETS_MOCK } from '../../mocks';
import { useAssetsView } from '@/store/features/assets-view/use-assets-view';

export const HomeStep = () => {
  const {} = useAssetsView();
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
      <InformationBox title="Assets Details" mb={9}>
        <Text color="#888E8F">Assets description here</Text>
      </InformationBox>

      <Header title="Your Assets" />

      {SONIC_ASSETS_MOCK.map(({ name, logo }) => (
        <Asset
          title={name}
          mainImgSrc={logo}
          onAdd={() => handleIncrement(name)}
          onRemove={() => handleDecrease(name)}
          mb={4}
        >
          {/* {asset.totalSupply && (
          <AssetContent price={asset.price} amount={asset.totalSupply} />
        )} */}
        </Asset>
      ))}
    </>
  );
};
