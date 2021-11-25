import { useActorStore } from '@/store/features/actor';

export const useCommonApi = () => {
  const { actors, tokenActors } = useActorStore();

  const { swapActor } = actors;

  async function getCommonTokenActor(canisterId: string) {
    return await GetAgent.commonTokenActor(canisterId);
  }
  async function commonNoIdentityActor(canisterId: string) {
    return await GetAgent.commonNoIdentityActor(canisterId);
  }

  async function getPair(
    token0: string,
    token1: string
  ): Promise<TokenPair[] | []> {
    try {
      const result = await (
        await this.getActor()
      ).getPair(
        Principal.fromText(token0) || '',
        Principal.fromText(token1) || ''
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
      const owner = authClient?.principal;
      return await (
        await this.getCommonTokenActor(tokenCanisterId)
      ).balanceOf(owner);
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
      const owner = authClient?.principal;
      return await (
        await this.getCommonTokenActor(tokenCanisterId)
      ).allowance(owner, Principal.fromText(spender));
    } catch (e) {
      console.log(e, 'approve');
      return e;
    }
  }

  return {
    getTokenInfo,
  };
};
