import { TokenData } from '@/models';

export type AddLiquidity = {
  token0: TokenData;
  token1: TokenData;
  slippage: number;
};

export type RemoveLiquidity = {
  token0: TokenData;
  token1: TokenData;
  slippage: number;
  lpAmount: number;
  principalId?: string;
};
