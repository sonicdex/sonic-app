import { icpSrc } from '@/assets';
import { AppTokenMetadata } from '@/models';

export const ICP_METADATA = {
  id: 'ICP', // ryjl3-tyaaa-aaaaa-aaaba-cai ICP
  name: 'Internet Computer Protocol',
  symbol: 'ICP',
  fee: BigInt(10000), // 0.0001
  decimals: 8,
  totalSupply: BigInt(0),
  logo: icpSrc,
  tokenType:'ICRC1'
};

export const getICPTokenMetadata = (price?: string): AppTokenMetadata => ({ ...ICP_METADATA, price});
