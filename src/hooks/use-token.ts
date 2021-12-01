import { Principal } from '@dfinity/principal';
import { useActorStore } from '@/store/features/actor';
import { useEffect } from 'react';
import { usePlugStore } from '@/store';
import { parseAmount } from '@/utils/format';
import { Actor, HttpAgent } from '@dfinity/agent';
import { ENV } from '@/config';
import { IDL } from '@dfinity/candid';
import { TokenIDL } from '@/did';
import { ActorAdapter } from '@/integrations/actor';

const getNotIdentifiedAgent = () => {
  return new HttpAgent({ host: ENV.host });
};

const getNotIdentifiedActor = (
  canisterId: string,
  factory: IDL.InterfaceFactory
) => {
  const agent = getNotIdentifiedAgent();

  return Actor.createActor(factory, {
    agent,
    canisterId,
  });
};

export const useToken = (canisterId?: string) => {
  const { principalId } = usePlugStore();
  const { actors, tokenActors, setTokenActors } = useActorStore();

  useEffect(() => {
    if (canisterId && !tokenActors[canisterId]) {
      new ActorAdapter(window.ic.plug)
        .createActor<TokenIDL.Factory>(canisterId, TokenIDL.factory)
        .then((newTokenActor) => {
          setTokenActors({ [canisterId]: newTokenActor });
        })
        .catch((error) => console.error(error));
    }
  }, [canisterId]);

  const getNotIdentifiedTokenActor = (canisterId: string) => {
    return getNotIdentifiedActor(canisterId, TokenIDL.factory);
  };

  const { swap: swapActor } = actors;

  async function getPair(token0: string, token1: string) {
    try {
      const result = await swapActor.getPair(
        Principal.fromText(token0),
        Principal.fromText(token1)
      );
      return (result as []).length ? (result as []) : [];
    } catch (e) {
      console.log(e, 'balanceOf');
      return e;
    }
  }

  async function getMetadata(tokenCanisterId: string) {
    try {
      return await getNotIdentifiedTokenActor(tokenCanisterId).getMetadata();
    } catch (e) {
      console.log(e, 'balanceOf');
      return e;
    }
  }
  async function getTokenInfo(tokenCanisterId: string) {
    try {
      return await getNotIdentifiedTokenActor(tokenCanisterId).getTokenInfo();
    } catch (e) {
      console.log(e, 'balanceOf');
      return e;
    }
  }
  // get wallet balanceof
  async function balanceOf(tokenCanisterId: string) {
    try {
      return await getNotIdentifiedTokenActor(tokenCanisterId).balanceOf(
        principalId
      );
    } catch (e) {
      console.log(e, 'balanceOf');
      return e;
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
      return e;
    }
  }
  async function allowance(
    tokenCanisterId: string,
    spender: string
  ): Promise<any> {
    try {
      return await getNotIdentifiedTokenActor(tokenCanisterId).allowance(
        principalId,
        Principal.fromText(spender)
      );
    } catch (e) {
      console.log(e, 'approve');
      return e;
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
