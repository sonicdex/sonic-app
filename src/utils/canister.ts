import { Principal } from '@dfinity/principal';
import { Pair } from '@memecake/sonic-js';

import { questionMarkSrc } from '@/assets';
import { ENV } from '@/config';
import { SwapIDL } from '@/did';
import { AppTokenMetadata, AppTokenMetadataListObject, PairBalances } from '@/models';

import { getFromStorage } from './local-storage';

var prorityOrder = ['WICP','XTC', 'ckBTC', 'SNS1', 'CHAT', 'BOX', 'OGY', 'YC', 'DONGE'];

export const desensitizationPrincipalId = (principalId?: string, firstLength = 5, lastLength = 3) => {
  if (principalId) {
    const firstPart = principalId.slice(0, firstLength);
    const secondPart = principalId.slice(
      principalId.length - lastLength,
      principalId.length
    );
    return `${firstPart}...${secondPart}`;
  }
};

export const parseResponseSupportedTokenList = (response: SwapIDL.TokenInfoExt[], price?: string): AppTokenMetadata[] => {
  var a1:any=[],a2:any=[];

  response.forEach((token) =>{
    const logo = getFromStorage(`${token.id}-logo`) || questionMarkSrc;
    var tempTkn = { ...token, ...(price ? { price } : {}), logo }
    var order = prorityOrder.findIndex(x=>x==token.symbol);
    var isBlocked = ENV.hiddenTokens.includes(token.id);
    if(!isBlocked){
      if(order!=-1){ a1[order]= tempTkn }
      else{  a2.push(tempTkn)}
    }
  })
  return [ ...a1, ...a2];
  console.log(response);
  
  // 
  // a1;a2;
  // var tokenList = response.filter((token) => !ENV.hiddenTokens.includes(token.id)).map((token) => {

  //   const logo = getFromStorage(`${token.id}-logo`) || questionMarkSrc;
  //   var order = prorityOrder.findIndex(x=>x==token.symbol);
  //   if(order!=-1){ a1[order]=  { ...token, ...(price ? { price } : {}), logo } }
  //   else a2.push()
    
    
  //  // console.log(token);

    



  //   return { ...token, ...(price ? { price } : {}), logo, };
  // });
  // var newList: any = [];
  // prorityOrder.forEach(el => { newList.push(tokenList.filter(x => x.symbol == el)[0]); });
  // console.log(tokenList)
  // tokenList.forEach(element => {
    
  // });
  return [];
};

export const parseResponseTokenList = (
  response: AppTokenMetadata[]
): AppTokenMetadataListObject => {
  return response.reduce((list, token) => {
    if (ENV.hiddenTokens.includes(token.id)) return list;
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

  const resultPair = pair[0];

  for (const token of [resultPair.token0, resultPair.token1]) {
    if (ENV.hiddenTokens.includes(token)) return undefined;
  }

  return pair[0];
};

export const parseResponseAllPairs = (
  response: SwapIDL.PairInfoExt[]
): Pair.List => {
  return response.reduce((list, pair) => {
    const { token0, token1, reserve0, reserve1 } = pair;
    for (const token of [token0, token1]) {
      if (ENV.hiddenTokens.includes(token)) return list;
    }

    return {
      ...list,
      [token0]: { ...list[token0], [token1]: pair },
      [token1]: { ...list[token1], [token0]: { ...pair, token0: token1, token1: token0, reserve0: reserve1, reserve1: reserve0 } },
    } as Pair.List;
  }, {} as Pair.List);
};

export const parseResponseUserLPBalances = (
  response: [tokenId: string, amount: bigint][]
): PairBalances => {
  return response.reduce((balances, [tokenId, amount]) => {
    const tokenIds = tokenId.split(':');

    for (const token of tokenIds) {
      if (ENV.hiddenTokens.includes(token)) return balances;
    }

    const [token0Id, token1Id] = tokenIds;

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

export const validPrincipalId = (principalId: string) => {
  try {
    return Boolean(Principal.fromText(principalId));
  } catch {
    return false;
  }
};
