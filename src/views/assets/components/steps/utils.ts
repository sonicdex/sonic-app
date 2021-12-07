import { SONIC_ASSETS_MOCK } from '../../mocks';

export const getTokenFromAsset = (tokenName: string) => {
  const asset = SONIC_ASSETS_MOCK.filter((a) => a.name === tokenName)[0];

  return {
    name: asset.name,
    logo: asset.logo,
  };
};
