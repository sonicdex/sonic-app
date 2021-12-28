import { SwapIDL } from '@/did';

export type TokenMetadata = SwapIDL.TokenInfoExt & {
  logo: string;
};

export type TokenMetadataList = { [canisterId: string]: TokenMetadata };

export type AppTokenMetadata = SwapIDL.TokenInfoExt & {
  logo: string;
  price?: string;
};

export type AppTokenMetadataList = AppTokenMetadata[];

export interface TokenData {
  metadata?: TokenMetadata;
  value: string;
}
