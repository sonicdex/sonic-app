import { SwapIDL } from '@/did';
import { useSwapCanisterStore , usePlugStore } from '@/store';
import { createAnonTokenActor } from '@/integrations/actor';
import  Artemis from 'artemis-web3-adapter';
var { supportedTokenList }:any=[], anonTokenActors:any ={ },tokenActors:any={};

export const artemis = new Artemis();

export const loadsupportedTokenList =async ()=>{
  var plugStat = usePlugStore();
  supportedTokenList = useSwapCanisterStore();
  if(plugStat.isConnected){ await artemis.connect('plug'); }
 
}

export const loadTokenActor= async (canisterId:string,tokenType:string , isAnnon:boolean)=>{
  if(isAnnon){
    if(!anonTokenActors[canisterId]){
      anonTokenActors[canisterId] = await createAnonTokenActor(canisterId, tokenType );
    }
    return anonTokenActors[canisterId];
  }else{
     if(!tokenActors[canisterId]){
      tokenActors[canisterId] = await createAnonTokenActor(canisterId, tokenType );
    }
    return anonTokenActors[canisterId];
  }
}


export const getTokenLogo=(canisterId:string, tokenType?:string):string=>{
  if(!supportedTokenList) return '';
  

  return ''
}

export const getWalletTokenBalance = (canisterId:string, tokenType?:string): string =>{
  if(!supportedTokenList) return '';
  console.log(SwapIDL , supportedTokenList , anonTokenActors , tokenActors)
  return 'ok'
}
