import { icpSrc } from '@/assets';
import { AppTokenMetadata } from '@/models';

export const ICP_TOKEN_METADATA = {
  id: 'ICP',
  name: 'Internet Computer Protocol',
  symbol: 'ICP',
  fee: BigInt(0),
  decimals: 8,
  totalSupply: BigInt(0),
  logo: icpSrc,
};

export const getICPTokenMetadata = (price?: string): AppTokenMetadata => ({
  ...ICP_TOKEN_METADATA,
  price,
});
