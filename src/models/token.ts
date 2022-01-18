import { SwapIDL } from '@/did';

export type AppTokenMetadata = SwapIDL.TokenInfoExt & {
  logo: string;
  price?: string;
};

export type AppTokenMetadataListObject = {
  [canisterId: string]: AppTokenMetadata;
};

export interface BaseTokenData<M = AppTokenMetadata> {
  metadata?: M;
  value: string;
}
