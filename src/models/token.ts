import { SwapIDL } from '@/did';

export type TokenMetadata = SwapIDL.TokenInfoExt & {
  logo?: string;
};

export type TokenMetadataList = { [canisterId: string]: TokenMetadata };

export type TokenDataKey = 'from' | 'to';

export interface TokenData {
  token?: TokenMetadata;
  value: string;
}
