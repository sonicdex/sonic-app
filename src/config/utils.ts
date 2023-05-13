import { sonicCircleSrc } from '@/assets';

import {artemis} from '@/integrations/artemis';

export type GetAppAssetsSourcesParams = {
  balances: {
    wallet?: number;
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
  var connectedWalletInfo = artemis.connectedWalletInfo;
  connectedWalletInfo;
  return [
    {
      name: connectedWalletInfo.name,
      src: connectedWalletInfo.icon,
      balance: balances.wallet,
    },
    {
      name: 'Sonic',
      src: sonicCircleSrc,
      balance: balances.sonic,
    },
  ];
};
