import { infoSrc } from '@/assets';
import { SwapIDL } from '@/did';
import { TokenMetadataList } from '@/models';

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
      logo: infoSrc,
    };
    return list;
  }, {} as TokenMetadataList);
};
