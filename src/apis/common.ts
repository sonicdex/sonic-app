import { GetAgent } from '@/utils/getAgent';
import { Principal } from '@dfinity/agent';
import { parseAmount } from '@/utils/formate';
import { TokenPair } from '@/types/global';
import { authClient } from '@/utils/getAgent/identity';

class Common {
  async getActor() {
    return await GetAgent.swapActor();
  }

  async getCommonTokenActor(canisterId: string) {
    return await GetAgent.commonTokenActor(canisterId);
  }
  async commonNoIdentityActor(canisterId: string) {
    return await GetAgent.commonNoIdentityActor(canisterId);
  }

  async getPair(token0: string, token1: string): Promise<TokenPair[] | []> {
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

  async getMetadata(tokenCanisterId) {
    try {
      return await (
        await this.commonNoIdentityActor(tokenCanisterId)
      ).getMetadata();
    } catch (e) {
      console.log(e, 'balanceOf');
      return e;
    }
  }
  async getTokenInfo(tokenCanisterId) {
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
  async balanceOf(tokenCanisterId: string) {
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

  async approve(
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
  async allowance(tokenCanisterId: string, spender: string): Promise<any> {
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
}

export const CommonApi = new Common();
