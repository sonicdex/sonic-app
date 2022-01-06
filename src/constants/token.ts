import { icpSrc } from '@/assets';
import { AppTokenMetadata } from '@/models';

export const ICP_METADATA = {
  id: 'ICP',
  name: 'Internet Computer Protocol',
  symbol: 'ICP',
  fee: BigInt(10000), // 0.0001
  decimals: 8,
  totalSupply: BigInt(0),
  logo: icpSrc,
};

export const getICPTokenMetadata = (price?: string): AppTokenMetadata => ({
  ...ICP_METADATA,
  price,
});
