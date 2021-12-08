import { TokenMetadata } from '.';

export type SwapDataKey = 'from' | 'to';

export interface SwapData {
  token?: TokenMetadata;
  value: string;
}
