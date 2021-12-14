import { plugCircleSrc, sonicCircleSrc } from '@/assets';

type GetAppAssetsSourcesOptions = {
  balances: {
    plug?: number;
    sonic?: number;
  };
};

export const getAppAssetsSources = ({
  balances,
}: GetAppAssetsSourcesOptions) => {
  return [
    {
      name: 'Plug Wallet',
      src: plugCircleSrc,
      balance: balances.plug,
    },
    {
      name: 'Sonic',
      src: sonicCircleSrc,
      balance: balances.sonic,
    },
  ];
};
