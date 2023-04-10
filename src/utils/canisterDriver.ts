import { TokenIDL, SwapIDL } from '@/did';
import { useSwapCanisterStore, usePlugStore } from '@/store';

import { Principal } from '@dfinity/principal';

import Artemis from 'artemis-web3-adapter';
import { AppTokenMetadata } from '@/models';

import { ENV } from '@/config';

var supportedTokenList: any = [];

var tokenListObj: any = {};
export const artemis = new Artemis();

export const loadsupportedTokenList = async () => {
  var plugStat = usePlugStore();
  supportedTokenList = useSwapCanisterStore()?.supportedTokenList;
  if (!supportedTokenList) return false;
  supportedTokenList.forEach((el: { id: string }) => { tokenListObj[el.id] = el });
  if (plugStat.isConnected) { await artemis.connect('plug'); }
}

export const tokenList = (returnType: 'array' | 'obj' , tokenId?:string): AppTokenMetadata[] | any => {
  return (returnType == 'array' && !tokenId) ? supportedTokenList :
    (!tokenId)? tokenListObj:tokenListObj[tokenId];
};

export const getTokenActor = async (canisterId: string, isAnnon: boolean): Promise<any> => {
  var token = tokenListObj?.[canisterId];
  if (!token) return false;
  var actor = false;
  var idl: any = token.tokenType == 'DIP20' ? TokenIDL.DIP20.factory :
    token.tokenType == 'YC' ? TokenIDL.DIP20.YCfactory :
      token.tokenType == 'ICRC1' ? TokenIDL.ICRC1.factory : TokenIDL.DIP20.factory;
  actor = await artemis.getCanisterActor(token.id, idl, isAnnon)
  return actor;
}

export const getswapActor = async (isAnnon: boolean): Promise<SwapIDL.Factory> => {
  var actor = await artemis.getCanisterActor(ENV.canistersPrincipalIDs.swap, SwapIDL.factory, isAnnon)
  return actor;
}

export const getTokenLogo = async (canisterId: string): Promise<string> => {
  var token = tokenListObj?.[canisterId];
  if (!token) return '';
  var tokenLogo = '';
  var tokenActor = await getTokenActor(token.id, true);
  if (!token?.tokenType || token?.tokenType == 'DIP20' || token?.tokenType == 'YC') {
    tokenLogo = await tokenActor.logo();
  } else if (token?.tokenType == 'ICRC1') {
    tokenLogo = "https://d15bmhsw4m27if.cloudfront.net/sonic/"+token.id
  }
  return tokenLogo;
}

export const getTokenBalance = async (canisterId: string): Promise<bigint> => {
  var tokenInfo = tokenListObj?.[canisterId];
  var tokenBalance: bigint = BigInt(0);
  if (!tokenInfo || !artemis.principalId) return tokenBalance;

  var tokenActor = await getTokenActor(tokenInfo.id, true);

  if (tokenInfo?.tokenType == 'DIP20' || tokenInfo?.tokenType == 'YC') {
    tokenBalance = await tokenActor.balanceOf(Principal.fromText(artemis.principalId));
  } else if (tokenInfo?.tokenType == 'ICRC1') {
    tokenBalance = await tokenActor.icrc1_balance_of({ owner: Principal.fromText(artemis.principalId), subaccount: [] });
  }
  return tokenBalance
}

export const getTokenAllowance = async (canisterId: string): Promise<bigint> => {

  var allowance = BigInt(0);
  var tokenInfo = tokenListObj?.[canisterId];
  if (!tokenInfo || !artemis.principalId) return allowance;

  var tokenActor = await getTokenActor(canisterId, true);
  if (tokenInfo?.tokenType == 'DIP20' || tokenInfo?.tokenType == 'YC') {
    allowance = await tokenActor.allowance(Principal.fromText(artemis.principalId), Principal.fromText(ENV.canistersPrincipalIDs.swap));
  } else allowance = BigInt(0);

  return allowance;
}

export const toHexString = (byteArray:[])  =>{
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}
export const fromHexString = (hex:string):number[] => {
  if(!hex) return [];
  if (hex.substr(0,2) === "0x") hex = hex.substr(2);
  for (var bytes:number[] = [], c = 0; c < hex.length; c += 2)
  bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}