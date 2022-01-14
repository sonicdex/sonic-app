import { SwapIDL } from '@/did';
import { MaximalPathsList } from '@/utils/maximal-paths';

export type AppTokenMetadata = SwapIDL.TokenInfoExt & {
  logo: string;
  price?: string;
};

export type AppTokenMetadataListObject = {
  [canisterId: string]: AppTokenMetadata;
};

export interface TokenData<M = AppTokenMetadata> {
  metadata?: M;
  value: string;
}

export interface SwapTokenMetadata extends AppTokenMetadata {
  paths: MaximalPathsList;
}
