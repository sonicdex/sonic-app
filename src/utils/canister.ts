import { questionMarkSrc } from '@/assets';
import { SwapIDL } from '@/did';
import { TokenMetadataList, PairList } from '@/models';

export const desensitizationPrincipalId = (
  principalId?: string,
  firstLength: number = 5,
  lastLength: number = 3
) => {
  if (principalId) {
    const firstPart = principalId.slice(0, firstLength);
    const secondPart = principalId.slice(
      principalId.length - lastLength,
      principalId.length
    );

    return `${firstPart}...${secondPart}`;
  }
};

export const parseResponseTokenList = (
  response: SwapIDL.TokenInfoExt[]
): TokenMetadataList => {
  return response.reduce((list, token) => {
    list[token.id] = {
      ...token,
      logo: questionMarkSrc,
    };
    return list;
  }, {} as TokenMetadataList);
};

export const parseResponsePair = (
  pair: [] | [SwapIDL.PairInfoExt]
): SwapIDL.PairInfoExt | undefined => {
  if (pair.length === 0) {
    return undefined;
  }

  return pair[0];
};

export const parseResponseAllPairs = (
  response: SwapIDL.PairInfoExt[]
): PairList => {
  return response.reduce((list, pair) => {
    const { token0, token1, reserve0, reserve1 } = pair;
    return {
      ...list,
      [token0]: {
        ...list[token0],
        [token1]: pair,
      },
      [token1]: {
        ...list[token1],
        [token0]: {
          ...pair,
          token0: token1,
          token1: token0,
          reserve0: reserve1,
          reserve1: reserve0,
        },
      },
    };
  }, {} as PairList);
};
