import { Principal } from '@dfinity/principal';
import { parseAmount } from '@/utils/format';
import { useActorStore } from '@/store/features/actor';
import { useToken } from '../../../hooks/use-token';

export const useLiquidityView = () => {
  const { actors } = useActorStore();
  const { getNotIdentifiedTokenActor } = useToken();
  const { swap: swapActor } = actors;

  async function getUserLPBalances(owner: Principal) {
    try {
      let result: unknown = await swapActor?.getUserLPBalances(owner);
      if (result) {
        const lps: any[] = [];
        for (const i of result as []) {
          const par: string[] = (i[0] as string).split(':');
          let LP: any = (await getPair(par[0], par[1]))?.[0];
          LP.lptokens = i[1];
          lps.push(LP);
        }
        return lps;
      }
    } catch (e) {
      console.log(e, 'balanceOf');
    }
  }

  async function getPair(token0: string, token1: string) {
    try {
      const result = await swapActor?.getPair(
        Principal.fromText(token0),
        Principal.fromText(token1)
      );
      return result ?? [];
    } catch (e) {
      console.log(e, 'balanceOf');
    }
  }

  function getTokenInfo(tokenCanisterId: string) {
    try {
      return getNotIdentifiedTokenActor(tokenCanisterId).getMetadata();
    } catch (e) {
      console.log(e, 'getTokenInfo');
    }
  }

  async function addLiquidity(
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
      return await swapActor?.addLiquidity(
        Principal.fromText(token0),
        Principal.fromText(token1),
        parseAmount(amount0, decimal0),
        parseAmount(amount1, decimal1),
        parseAmount(amount0Min, decimal0),
        parseAmount(amount1Min, decimal1),
        BigInt(currentTime)
      );
    } catch (e) {
      console.log(e, 'balanceOf');
    }
  }
  async function removeLiquidity(
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
      // TODO: Fix parameters
      return await (swapActor as any).removeLiquidity(
        Principal.fromText(token0),
        Principal.fromText(token1),
        BigInt(lpAmount),
        parseAmount(amount0Min, Number(decimal0)),
        parseAmount(amount1Min, Number(decimal1)),
        BigInt(currentTime)
      );
    } catch (e) {
      console.log(e, 'balanceOf');
    }
  }

  return {
    getUserLPBalances,
    getPair,
    getTokenInfo,
    addLiquidity,
    removeLiquidity,
  };
};
