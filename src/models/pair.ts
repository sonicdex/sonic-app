import { SwapIDL } from '@/did';

export type Pair = SwapIDL.PairInfoExt;

export type PairList = {
  [canisterId: string]: {
    [pairedCanisterId: string]: Pair;
  };
};
