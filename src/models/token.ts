import { SwapIDL } from '@/did';

export type SupportedToken = SwapIDL.TokenInfoExt & {
  logo?: string;
};

export type SupportedTokenList = { [canisterId: string]: SupportedToken };
