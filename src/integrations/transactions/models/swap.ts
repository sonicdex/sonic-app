import { TokenData } from '@/models';

export type Swap = {
  from: TokenData;
  to: TokenData;
  slippage: number;
  principalId?: string;
};
