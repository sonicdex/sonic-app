import {  ActorAdapter, createTokenActor as cta } from '@memecake/sonic-js';
import { TokenIDL } from '@/did';
export const createTokenActor = cta;

export const createAnonTokenActor =  async (canisterId: string , tokenType?:string): Promise<any> =>{
  if( tokenType == 'DIP20')
    return ActorAdapter.createAnonymousActor<TokenIDL.DIP20.Factory>( canisterId,TokenIDL.DIP20.factory);
  else if( tokenType == 'YC')
  return ActorAdapter.createAnonymousActor<TokenIDL.DIP20.YCResult>( canisterId,TokenIDL.DIP20.YCfactory);
  else if( tokenType == 'ICRC1')
    return ActorAdapter.createAnonymousActor<TokenIDL.ICRC1.Factory>( canisterId,TokenIDL.ICRC1.factory);
  else
    return ActorAdapter.createAnonymousActor<TokenIDL.DIP20.Factory>( canisterId,TokenIDL.DIP20.factory);
}
  
