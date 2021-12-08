import { Principal } from '@dfinity/principal';
import { useEffect } from 'react';
import { usePlugStore } from '@/store';
import { parseAmount } from '@/utils/format';
import { Actor, HttpAgent } from '@dfinity/agent';
import { ENV } from '@/config';
import { IDL } from '@dfinity/candid';
import { TokenIDL } from '@/did';
import { ActorAdapter, appActors } from '@/integrations/actor';

const getNotIdentifiedAgent = () => {
  return new HttpAgent({ host: ENV.host });
};

const getNotIdentifiedActor = (
  canisterId: string,
  factory: IDL.InterfaceFactory
) => {
  const agent = getNotIdentifiedAgent();

  return Actor.createActor<TokenIDL.Factory>(factory, {
    agent,
    canisterId,
  });
};

export const useToken = (canisterId?: string) => {
  const { principalId } = usePlugStore();

  useEffect(() => {
    if (canisterId) {
      new ActorAdapter(window.ic?.plug)
        .createActor<TokenIDL.Factory>(canisterId, TokenIDL.factory)
        .catch((error) => console.error(error));
    }
  }, [canisterId]);

  const getNotIdentifiedTokenActor = (canisterId: string) => {
    return getNotIdentifiedActor(canisterId, TokenIDL.factory);
  };

  async function getPair(token0: string, token1: string) {
    try {
      const result = await appActors[ENV.canisterIds.swap]?.getPair(
        Principal.fromText(token0),
        Principal.fromText(token1)
      );
      return (result as []).length ? (result as []) : [];
    } catch (e) {
      console.log(e, 'getPair');
    }
  }

  async function getMetadata(tokenCanisterId: string) {
    try {
      return await getNotIdentifiedTokenActor(tokenCanisterId).getMetadata();
    } catch (e) {
      console.log(e, 'getMetadata');
    }
  }
  async function getTokenInfo(tokenCanisterId: string) {
    try {
      return await getNotIdentifiedTokenActor(tokenCanisterId).getTokenInfo();
    } catch (e) {
      console.log(e, 'getTokenInfo');
    }
  }
  // get wallet balanceof
  async function balanceOf(tokenCanisterId: string) {
    if (principalId) {
      try {
        return await getNotIdentifiedTokenActor(tokenCanisterId).balanceOf(
          Principal.fromText(principalId)
        );
      } catch (e) {
        console.log(e, 'balanceOf');
      }
    }
  }

  async function approve(
    tokenCanisterId: string,
    spender: string,
    value: string | number,
    decimals: number
  ): Promise<any> {
    try {
      const amount = parseAmount(value.toString(), decimals);
      return await getNotIdentifiedTokenActor(tokenCanisterId).approve(
        Principal.fromText(spender),
        amount
      );
    } catch (e) {
      console.log(e, 'approve');
    }
  }
  async function allowance(
    tokenCanisterId: string,
    spender: string
  ): Promise<any> {
    if (principalId) {
      try {
        return await getNotIdentifiedTokenActor(tokenCanisterId).allowance(
          Principal.fromText(principalId),
          Principal.fromText(spender)
        );
      } catch (e) {
        console.log(e, 'approve');
      }
    }
  }

  return {
    getTokenInfo,
    approve,
    balanceOf,
    getMetadata,
    getPair,
    allowance,
    getNotIdentifiedTokenActor,
  };
};
