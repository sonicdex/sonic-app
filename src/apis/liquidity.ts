import { GetAgent } from '@/utils/getAgent';
import { Principal } from '@dfinity/agent';
import { parseAmount } from '@/utils/formate';
import { TokenPair } from '@/types/global';

class Liquidity {
  async getActor() {
    return await GetAgent.swapActor();
  }

  async getCommonTokenActor(canisterId: string) {
    return await GetAgent.commonTokenActor(canisterId);
  }

  async getUserLPBalances(owner: Principal) {
    try {
      let result: unknown = await (
        await this.getActor()
      ).getUserLPBalances(owner);
      if (result) {
        const lps: any[] = [];
        for (const i of result as []) {
          const par: string[] = (i[0] as string).split(':');
          let LP = (await this.getPair(par[0], par[1]))[0];
          LP.lptokens = i[1];
          lps.push(LP);
        }
        return lps;
      }
    } catch (e) {
      console.log(e, 'balanceOf');
      return e;
    }
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

  async getTokenInfo(tokenCanisterId) {
    try {
      return await (
        await this.getCommonTokenActor(tokenCanisterId)
      ).getMetadata();
    } catch (e) {
      console.log(e, 'getTokenInfo');
      return e;
    }
  }

  async addLiquidity(
    token0: string,
    token1: string,
    amount0: string,
    amount1: string,
    amount0Min: string,
    amount1Min: string,
    decimal0: number,
    decimal1: number
  ) {
    try {
      const currentTime = (new Date().getTime() + 5 * 60 * 1000) * 10000000;
      return await (
        await this.getActor()
      ).addLiquidity(
        Principal.fromText(token0),
        Principal.fromText(token1),
        parseAmount(amount0, decimal0),
        parseAmount(amount1, decimal1),
        parseAmount(amount0Min, decimal0),
        parseAmount(amount1Min, decimal1),
        currentTime
      );
    } catch (e) {
      console.log(e, 'balanceOf');
      return e;
    }
  }
  async removeLiquidity(
    token0: string,
    token1: string,
    lpAmount: string,
    amount0Min: string,
    amount1Min: string,
    decimal0: number | string,
    decimal1: number | string
  ) {
    try {
      const currentTime = (new Date().getTime() + 5 * 60 * 1000) * 10000000;
      return await (
        await this.getActor()
      ).removeLiquidity(
        Principal.fromText(token0),
        Principal.fromText(token1),
        BigInt(lpAmount),
        parseAmount(amount0Min, Number(decimal0)),
        parseAmount(amount1Min, Number(decimal1)),
        currentTime
      );
    } catch (e) {
      console.log(e, 'balanceOf');
      return e;
    }
  }
}

export const LiquidityApi = new Liquidity();
