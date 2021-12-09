import { SwapData } from '@/models/swap';

export type Swap = {
  from: SwapData;
  to: SwapData;
  slippage: number;
  principalId?: string;
};
