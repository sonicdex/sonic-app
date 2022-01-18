import { SwapTokenData } from '@/store';

export type Swap = {
  from: SwapTokenData;
  to: SwapTokenData;
  slippage: number;
  principalId?: string;
  allowance?: number;
};
