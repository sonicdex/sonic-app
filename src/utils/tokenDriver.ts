import { TokenIDL } from '@/did';
import { useSwapCanisterStore , usePlugStore } from '@/store';

import  Artemis from 'artemis-web3-adapter';
import { AppTokenMetadata } from '@/models';

var supportedTokenList:any=[];

export const artemis = new Artemis();

export const loadsupportedTokenList = async ()=>{
  var plugStat = usePlugStore();
  supportedTokenList =  useSwapCanisterStore()?.supportedTokenList;
  if(plugStat.isConnected){ await artemis.connect('plug'); }
}
export const tokenList= ():AppTokenMetadata[]=>{ return supportedTokenList};

export const getTokenActor = async (canisterId:string, isAnnon:boolean):Promise<any>=>{
  if(!supportedTokenList) return false;

  var actor=false;
  var token = supportedTokenList.find( (elm:AppTokenMetadata) => elm.id == canisterId);
  var idl:any = token.tokenType =='DIP20'? TokenIDL.DIP20.factory: 
    token.tokenType =='YC'?TokenIDL.DIP20.YCfactory:
    token.tokenType =='ICRC1'?TokenIDL.ICRC1.factory:TokenIDL.DIP20.factory;

    if(isAnnon){
      actor = await artemis.getCanisterActor(token.id, idl , isAnnon )
    }else
     actor = await artemis.getCanisterActor(token.id, idl , false )
    return actor;
}

export const getTokenLogo=async (canisterId:string):Promise<string>=>{
  if(!supportedTokenList) return '';
  var tokenLogo = ''
  var token= supportedTokenList.find( (elm:AppTokenMetadata) => elm.id == canisterId);
  var tokenActor = await getTokenActor(token.id,true);
  if(!token?.tokenType || token?.tokenType == 'DIP20' || token?.tokenType =='YC'){
    tokenLogo = await tokenActor.logo();
  }else if(token?.tokenType == 'ICRC1'){
    tokenLogo =''
  }
  return tokenLogo;
}

export const getWalletTokenBalance = (canisterId:string, tokenType?:string): string =>{
  if(!supportedTokenList) return '';
  console.log('supportedTokenList', supportedTokenList)
  return 'ok'
}
