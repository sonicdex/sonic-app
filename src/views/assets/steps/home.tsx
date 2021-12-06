import { Box } from '@chakra-ui/react';

import { InformationBox, Header, IncrementBox } from '@/components';
// import { AssetContent } from '../components';
import { SupportedToken } from '@/models';

type HomeStepProps = {
  sonicAssets: Partial<SupportedToken>[];
  handleIncrement: (value?: string) => any;
  handleDecrease: (value?: string) => any;
  showInformation?: boolean;
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
  showInformation = false,
}: HomeStepProps) => (
  <>
    {showInformation && (
      <InformationBox title="Assets Details" mb="37px">
        <InformationDescription />
      </InformationBox>
    )}
    <Header title="Your Assets" />
    {sonicAssets.map((asset) => (
      <Box mb="20px" key={asset.name}>
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
