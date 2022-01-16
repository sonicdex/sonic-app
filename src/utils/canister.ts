import { questionMarkSrc, xtcSrc } from '@/assets';
import { ENV, getFromStorage } from '@/config';
import { SwapIDL } from '@/did';
import {
  AppTokenMetadata,
  AppTokenMetadataListObject,
  PairBalances,
  PairList,
} from '@/models';

export const desensitizationPrincipalId = (
  principalId?: string,
  firstLength = 5,
  lastLength = 3
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

export const parseResponseSupportedTokenList = (
  response: SwapIDL.TokenInfoExt[],
  price?: string
): AppTokenMetadata[] => {
  return response.map((token) => {
    // FIXME: remove hardcode, once XTC logo will be fixed
    let logo;
    if (token.id === ENV.canistersPrincipalIDs.XTC) {
      logo = xtcSrc;
    }

    if (token.id !== ENV.canistersPrincipalIDs.XTC) {
      logo = getFromStorage(`${token.id}-logo`) ?? questionMarkSrc;
    }

    return {
      ...token,
      ...(price ? { price } : {}),
      logo,
    };
  });
};

export const parseResponseTokenList = (
  response: AppTokenMetadata[]
): AppTokenMetadataListObject => {
  return response.reduce((list, token) => {
    list[token.id] = token;
    return list;
  }, {} as AppTokenMetadataListObject);
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

    if (Number(reserve0) === 0 && Number(reserve1) === 0) {
      return list;
    }

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

export const parseResponseUserLPBalances = (
  response: [tokenId: string, amount: bigint][]
): PairBalances => {
  return response.reduce((balances, [tokenId, amount]) => {
    const [token0Id, token1Id] = tokenId.split(':');

    return {
      ...balances,
      [token0Id]: {
        ...balances[token0Id],
        [token1Id]: Number(amount),
      },
      [token1Id]: {
        ...balances[token1Id],
        [token0Id]: Number(amount),
      },
    };
  }, {} as PairBalances);
};
