import { TokenData } from '@/models';

export type AddLiquidity = {
  token0: TokenData;
  token1: TokenData;
  slippage: number;
  allowance0?: number;
  allowance1?: number;
};

export type RemoveLiquidity = {
  token0: Required<TokenData>;
  token1: Required<TokenData>;
  amount0Min: number;
  amount1Min: number;
  lpAmount: number;
  principalId?: string;
};
