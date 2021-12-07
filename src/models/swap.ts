import { SupportedToken } from '.';

export type SwapDataKey = 'from' | 'to';

export interface SwapData {
  token?: SupportedToken;
  value: string;
}
