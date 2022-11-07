import { SwapIDL } from '@/did';

export type Pair = SwapIDL.PairInfoExt;

export type PairBalances = {
  [canisterId: string]: {
    [canisterId: string]: number;
  };
};
