import { SwapIDL } from '@/did';

export type Pair = Omit<SwapIDL.PairInfoExt, ''>;

export type PairList = {
  [canisterId: string]: {
    [pairedCanisterId: string]: Pair;
  };
};
