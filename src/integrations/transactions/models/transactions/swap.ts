import { SwapTokenMetadata, TokenData } from '@/models';

export type Swap = {
  from: TokenData<SwapTokenMetadata>;
  to: TokenData<SwapTokenMetadata>;
  slippage: number;
  principalId?: string;
  allowance?: number;
};
