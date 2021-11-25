import { Principal } from '@dfinity/principal';
import { useActorStore } from '@/store/features/actor';
import { useEffect } from 'react';
import { usePlugStore } from '@/store';

export const useToken = (canisterId: string) => {
  const { principalId } = usePlugStore();
  const { actors, tokenActors } = useActorStore();

  useEffect(() => {}, [canisterId]);

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

  async function getMetadata(tokenCanisterId) {
    try {
      return await (
        await this.commonNoIdentityActor(tokenCanisterId)
      ).getMetadata();
    } catch (e) {
      console.log(e, 'balanceOf');
      return e;
    }
  }
  async function getTokenInfo(tokenCanisterId) {
    try {
      return await (
        await this.getCommonTokenActor(tokenCanisterId)
      ).getTokenInfo();
    } catch (e) {
      console.log(e, 'balanceOf');
      return e;
    }
  }
  // get wallet balanceof
  async function balanceOf(tokenCanisterId: string) {
    try {
      return await (
        await this.getCommonTokenActor(tokenCanisterId)
      ).balanceOf(principalId);
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
      return await (
        await this.getCommonTokenActor(tokenCanisterId)
      ).approve(Principal.fromText(spender), amount);
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
      return await (
        await this.getCommonTokenActor(tokenCanisterId)
      ).allowance(principalId, Principal.fromText(spender));
    } catch (e) {
      console.log(e, 'approve');
      return e;
    }
  }

  return {
    getTokenInfo,
  };
};
