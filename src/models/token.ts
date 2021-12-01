import { SwapIDL } from '@/did';

export type SupportedToken = SwapIDL.TokenInfoExt & {
  img?: string;
};

export type SupportedTokenList = { [canisterId: string]: SupportedToken };
