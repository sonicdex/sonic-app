import { SwapIDL } from '@/did';

export type Pair = SwapIDL.PairInfoExt;

export type PairList = {
  [canisterId: string]: {
    [canisterId: string]: Pair;
  };
};

export type PairBalances = {
  [canisterId: string]: {
    [canisterId: string]: number;
  };
};
