import { GetAgent } from '@/utils/getAgent';
import { TokenValue, TokenInfo } from '@/types/global';
import { Principal } from '@dfinity/agent';
import { parseAmount } from '@/utils/formate';
import { authClient } from '@/utils/getAgent/identity';
import { CommonApi } from './common';
class Assets {
  async getActor() {
    return await GetAgent.swapActor();
  }

  async getTokens(): Promise<TokenValue[]> {
    try {
      let res = await (await this.getActor()).getSupportedTokenList();
      return res as TokenValue[];
    } catch (e) {
      return Promise.resolve(e);
    }
  }

  async getUserInfoByNamePageAbove(_owner: Principal): Promise<TokenInfo[]> {
    try {
      const result = await (
        await this.getActor()
      ).getUserInfoByNamePageAbove(
        _owner,
        0,
        '', // token name
        0, // token start at
        0, // token limit
        0, // above 0
        '', // lp name or symbol
        0,
        10
      );
      const res = (result as { lpBalances: [[string, BigInt][], BigInt] })
        .lpBalances[0];
      if (!res.length) {
        return [];
      }
      const info = await Promise.all(
        res.map((_i) => CommonApi.getTokenInfo(String(_i[0])))
      );
      return info.map((i, index) => {
        i = { ...i.metadata, ...i };
        delete i.metadata;
        return { ...i, bal: res[index][1], id: res[index][0] };
      });
      // CommonApi
    } catch (e) {
      console.log(e, 'getUserInfoByNamePageAbove');
      return e;
    }
  }

  async deposit(
    tokenCanisterId: string,
    value: string | number,
    decimals: number
  ) {
    try {
      const amount = parseAmount(value.toString(), decimals);
      return await (
        await this.getActor()
      ).deposit(Principal.fromText(tokenCanisterId), amount);
    } catch (e) {
      console.log(e, 'deposit');
      return e;
    }
  }

  async withDraw(
    tokenCanisterId: string,
    value: string | number,
    decimals: number
  ) {
    try {
      const amount = parseAmount(value.toString(), decimals);
      debugger;
      return await (
        await this.getActor()
      ).withdraw(Principal.fromText(tokenCanisterId), amount);
    } catch (e) {
      console.log(e, 'withDraw');
      return e;
    }
  }
  // get swap balanceof
  async balanceOf(tokenCanisterId: string) {
    try {
      const owner = authClient?.principal;
      return await (await this.getActor()).balanceOf(tokenCanisterId, owner);
    } catch (e) {
      console.log(e, 'balanceOf');
      return e;
    }
  }

  async getTokenList(): Promise<any> {
    // const count = (await this.getActor()).getTokenCount();
    console.log(this.getTokens(), 90);
    // const res = await this.getTokens(0, 80);
    // const newTokens: Token[] = res.map((i) => i[0]);
    // return [newTokens, count as unknown as BigInt];
  }
}

export const AssetsApi = new Assets();
