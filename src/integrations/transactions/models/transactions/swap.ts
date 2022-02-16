import { SwapTokenData } from '@/store';

export type SwapModel = {
  from: SwapTokenData;
  to: SwapTokenData;
  slippage: number;
  principalId?: string;
  allowance?: number;
};
