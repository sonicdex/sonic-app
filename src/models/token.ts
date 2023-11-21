import { Token } from '@sonicdex/sonic-js';

export type AppTokenMetadata = Token.Metadata & {
  logo: string;
  price?: string;
  tokenType?:string,
  blockStatus?:string,
};

export type AppTokenMetadataListObject = {
  [canisterId: string]: AppTokenMetadata;
};

export interface BaseTokenData<M = AppTokenMetadata> {
  metadata?: M;
  value: string;
}
