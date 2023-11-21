import { TokenIDL, SwapIDL, capCanIDL } from '@/did';
import { useSwapCanisterStore } from '@/store';

import { Principal } from '@dfinity/principal';

import { artemis } from '@/integrations/artemis';

import { AppTokenMetadata } from '@/models';
import { ENV } from '@/config';

import crc32 from 'buffer-crc32';
import { Buffer } from 'buffer';
import crypto from "crypto-js";

var supportedTokenList: any = [];
var tokenListObj: any = {};

function waitWithTimeout(ms:number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Timeout')), ms);
  });
}


export const loadsupportedTokenList = async () => {
  supportedTokenList = useSwapCanisterStore()?.supportedTokenList;
  if (!supportedTokenList || Object.keys(tokenListObj).length > 0) return false;

  //console.log(supportedTokenList);
  
  supportedTokenList.forEach((el: { id: string }) => { tokenListObj[el.id] = el });

  // if (isConnected) { 
  //   [...Object.values(ENV.canistersPrincipalIDs),...Object.keys(supportedTokenList)]
  //   artemis.connect('plug',); }
}

export const tokenList = (returnType: 'array' | 'obj', tokenId?: string): AppTokenMetadata[] | any => {
  return (returnType == 'array' && !tokenId) ? supportedTokenList :
    (!tokenId) ? tokenListObj : tokenListObj[tokenId];
};

export const getTokenActor = async (canisterId: string, isAnnon: boolean): Promise<any> => {

  var token = tokenListObj?.[canisterId];
  if (!token) return false;
  var actor = false;
  var idl: any = token.tokenType == 'DIP20' ? TokenIDL.DIP20.factory :
    token.tokenType == 'YC' ? TokenIDL.DIP20.YCfactory :
      token.tokenType == 'ICRC1' ? TokenIDL.ICRC1.factory : TokenIDL.DIP20.factory;

  if(token?.symbol == 'SNEED'){ idl = TokenIDL.SNEED;} 
  if (isAnnon == false && !artemis.provider) { await artemis.autoConnect(); }
  actor = await artemis.getCanisterActor(token.id, idl, isAnnon);
  return actor;
}

export const getswapActor = async (isAnnon: boolean): Promise<SwapIDL.Factory> => {
  if (!isAnnon && !artemis.provider) {
    await artemis.autoConnect();
  }
  var actor = await artemis.getCanisterActor(ENV.canistersPrincipalIDs.swap, SwapIDL.factory, isAnnon);
  return actor;
}



export const getSwapCapActor = async (isAnnon: boolean): Promise<capCanIDL.Factory> => {
  if (!isAnnon && !artemis.provider) {
    await artemis.autoConnect();
  }
  var actor = await artemis.getCanisterActor(ENV.canistersPrincipalIDs.swapCapRoot, capCanIDL.factory, isAnnon);
  return actor;
}


export const getTokenLogo = async (canisterId: string): Promise<string> => {
  var token = tokenListObj?.[canisterId];
  if (!token) return '';
  var tokenLogo = '';
  var tokenActor = await getTokenActor(token.id, true);
  try {
    if (!token?.tokenType || token?.tokenType == 'DIP20' || token?.tokenType == 'YC') {
      tokenLogo = await tokenActor.logo();
    } else if (token?.tokenType == 'ICRC1') {
      tokenLogo = "https://d15bmhsw4m27if.cloudfront.net/sonic/" + token.id
    }
  } catch (error) {
    tokenLogo = ''
  }

  return tokenLogo;
}

export const getTokenBalance = async (canisterId: string, principalId?: string): Promise<bigint> => {
  var tokenInfo = tokenListObj?.[canisterId];
  var tokenBalance: bigint = BigInt(0);
  if (!tokenInfo) { return tokenBalance; }
  var prin = artemis.principalId ? artemis.principalId : principalId;

  if (!prin) return tokenBalance;
  
  try {
    var tokenActor = await getTokenActor(tokenInfo.id, true);
    if (tokenInfo?.tokenType == 'DIP20' || tokenInfo?.tokenType == 'YC') {
      tokenBalance =  await Promise.race([
        tokenActor.balanceOf(Principal.fromText(prin)), 
        waitWithTimeout(10000) 
      ]);
    } else if (tokenInfo?.tokenType == 'ICRC1') {
      tokenBalance =  await Promise.race([
        tokenActor.icrc1_balance_of({ owner: Principal.fromText(prin), subaccount: [] }),
        waitWithTimeout(10000) 
      ]);
    }
  } catch (error) {
    tokenBalance = BigInt(0);
   // console.log(tokenInfo.name+' ('+ tokenInfo.id +') failed to load !!!' );
  }
   return tokenBalance;
}

export const getTokenAllowance = async (canisterId: string): Promise<bigint> => {

  var allowance = BigInt(0);
  var tokenInfo = tokenListObj?.[canisterId];
  if (!tokenInfo || !artemis.principalId) return allowance;

  try {
    var tokenActor = await getTokenActor(canisterId, true);
    if (tokenInfo?.tokenType == 'DIP20' || tokenInfo?.tokenType == 'YC') {
      allowance = await tokenActor.allowance(Principal.fromText(artemis.principalId), Principal.fromText(ENV.canistersPrincipalIDs.swap));
    } else allowance = BigInt(0);
  } catch (error) {
    allowance = BigInt(0);
  }
  return allowance;
}

export const toHexString = (byteArray: []) => {
  return Array.from(byteArray, function (byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}
export const fromHexString = (hex: string): number[] => {
  if (!hex) return [];
  if (hex.substr(0, 2) === "0x") hex = hex.substr(2);
  for (var bytes: number[] = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}
export const checkAddressType = (address: string): string => {
  if (address.length < 23) return 'invalid';
  if (isValidAccountId(address)) return 'accountId';
  else if (isPrincipalId(address)) return 'principalId';
  else return 'invalid'

  function isPrincipalId(id: string) {
    try {
      Principal.fromText(id); return true;
    } catch (error) {
      return false;
    }
  }
  function isValidAccountId(accountId: string) {
    const accountIdRegex = /^[A-Fa-f0-9]{64}$/;
    return accountIdRegex.test(accountId);
  }
}
const ACCOUNT_DOMAIN_SEPERATOR = '\x0Aaccount-id';
const SUB_ACCOUNT_ZERO = Buffer.alloc(32);

const byteArrayToWordArray = (byteArray: any) => {
  const wordArray: any = [];
  let i;
  for (i = 0; i < byteArray.length; i += 1) {
    wordArray[(i / 4) | 0] |= byteArray[i] << (24 - 8 * i);
  }
  // eslint-disable-next-line
  const result = crypto.lib.WordArray.create(wordArray, byteArray.length);
  return result;
};
const wordToByteArray = (word: any, length: number) => {
  const byteArray = [];
  const xFF = 0xff;
  if (length > 0) byteArray.push(word >>> 24);
  if (length > 1) byteArray.push((word >>> 16) & xFF);
  if (length > 2) byteArray.push((word >>> 8) & xFF);
  if (length > 3) byteArray.push(word & xFF);

  return byteArray;
};
const wordArrayToByteArray = (wordArray: any, length: number) => {
  if (
    wordArray.hasOwnProperty('sigBytes') &&
    wordArray.hasOwnProperty('words')
  ) {
    length = wordArray.sigBytes;
    wordArray = wordArray.words;
  }

  let result: any = [];
  let bytes;
  let i = 0;
  while (length > 0) {
    bytes = wordToByteArray(wordArray[i], Math.min(4, length));
    length -= bytes.length;
    result = [...result, bytes];
    i++;
  }
  return [].concat.apply([], result);
};
const generateChecksum = (hash: any) => {
  const crc = crc32.unsigned(Buffer.from(hash));
  const hex = intToHex(crc);
  return hex.padStart(8, '0');
};

const intToHex = (val: any) =>
  val < 0 ? (Number(val) >>> 0).toString(16) : Number(val).toString(16);

export const getAccountIdFromPrincipalId = (principalId: string) => {

  try {
    var principal = Principal.from(principalId);
    const sha = crypto.algo.SHA224.create();
    sha.update(ACCOUNT_DOMAIN_SEPERATOR); // Internally parsed with UTF-8, like go does
    sha.update(byteArrayToWordArray(principal.toUint8Array()));
    const subBuffer = Buffer.from(SUB_ACCOUNT_ZERO);

    sha.update(byteArrayToWordArray(subBuffer));
    const hash = sha.finalize();
    const byteArray = wordArrayToByteArray(hash, 28);
    const checksum = generateChecksum(byteArray);
    const val = checksum + hash.toString();
    return val;
  } catch (error) { return '' }
}

export const getPrincipalFromText = (prin: string) => {
  try {
    return Principal.fromText(prin)
  } catch (error) { return false }
}