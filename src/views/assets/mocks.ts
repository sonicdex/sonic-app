import { SupportedToken } from '@/models';
import { TOKEN } from '@/constants';

export const SONIC_ASSETS_MOCK: Partial<SupportedToken>[] = [
  {
    name: 'XTC',
    totalSupply: BigInt(400),
    logo: TOKEN.XTC.logo,
  },
  {
    name: 'WICP',
    totalSupply: BigInt(100),
    logo: TOKEN.WICP.logo,
  },
  {
    name: 'ICP',
    totalSupply: BigInt(200),
    logo: TOKEN.ICP.logo,
  },
];
