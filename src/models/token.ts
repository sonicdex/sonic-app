import { Token } from '@psychedelic/sonic-js';

export type AppTokenMetadata = Token.Metadata & {
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
