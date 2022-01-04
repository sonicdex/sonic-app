import { SwapIDL } from '@/did';

export type AppTokenMetadata = SwapIDL.TokenInfoExt & {
  logo: string;
  price?: string;
};

export type AppTokenMetadataListObject = {
  [canisterId: string]: AppTokenMetadata;
};

export interface TokenData {
  metadata?: AppTokenMetadata;
  value: string;
}
