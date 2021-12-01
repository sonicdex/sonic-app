import { Flex, Box } from '@chakra-ui/react';

import {
  InformationBox,
  Header,
  IncrementBox
} from '@/components';
import { AssetContent } from '../components';

type SonicAsset = {
  name: string,
  amount: string,
  price: string,
  img: string, 
};

type HomeStepProps = {
  sonicAssets: Array<SonicAsset>,
  handleIncrement: (string) => any,
  handleDecrease: (string) => any,
  showInformation?: boolean,
};

const InformationDescription = () => (
  <Box as="p" color="#888E8F">
    Assets description here
  </Box>
);

export const HomeStep = ({
  sonicAssets,
  handleIncrement,
  handleDecrease,
  showInformation = false
}: HomeStepProps) => (
  <>
    { showInformation && (
      <InformationBox title="Assets Details" mb="37px">
        <InformationDescription />
      </InformationBox>
    )}
    <Header
      title="Your Assets"
    />
    { sonicAssets.map((asset) => (
      <Box mb="20px" key={asset.name}>
        <IncrementBox
          title={asset.name}
          mainImg={asset.img}
          onIncrement={() => handleIncrement(asset.name)}
          onDecreace={() => handleDecrease(asset.name)}
        >
          <AssetContent price={asset.price} amount={asset.amount} />
        </IncrementBox>
      </Box>
    ))}
  </>
);
