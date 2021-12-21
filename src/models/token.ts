import { SwapIDL } from '@/did';

export type TokenMetadata = SwapIDL.TokenInfoExt & {
  logo: string;
};

export type TokenMetadataList = { [canisterId: string]: TokenMetadata };

export type SupportedTokenList = (SwapIDL.TokenInfoExt & { logo: string })[];

export interface TokenData {
  metadata?: TokenMetadata;
  value: string;
}
