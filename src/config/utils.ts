import { plugCircleSrc, sonicCircleSrc } from '@/assets';

export type GetAppAssetsSourcesParams = {
  balances: {
    plug?: number;
    sonic?: number;
  };
};

export type AppAssetSource = {
  name: string;
  src: string;
  balance?: number;
};

export const getAppAssetsSources = ({
  balances,
}: GetAppAssetsSourcesParams): AppAssetSource[] => {
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
