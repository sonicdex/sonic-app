import { icpSrc } from '@/assets';
import { AppTokenMetadata } from '@/models';

export const getICPTokenMetadata = (price?: string): AppTokenMetadata => ({
  id: 'ICP',
  name: 'Internet Computer Protocol',
  symbol: 'ICP',
  fee: BigInt(0),
  decimals: 0,
  totalSupply: BigInt(0),
  logo: icpSrc,
  price,
});
