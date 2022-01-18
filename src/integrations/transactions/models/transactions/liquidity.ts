import { BaseTokenData } from '@/models';

export type AddLiquidity = {
  token0: BaseTokenData;
  token1: BaseTokenData;
  slippage: number;
  allowance0?: number;
  allowance1?: number;
};

export type RemoveLiquidity = {
  token0: Required<BaseTokenData>;
  token1: Required<BaseTokenData>;
  amount0Min: number;
  amount1Min: number;
  lpAmount: number;
  principalId?: string;
};
