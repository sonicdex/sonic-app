import { GetAgent } from '@/utils/getAgent';
import { parseAmount } from '@/utils/formate';
import { authClient } from '@/utils/getAgent/identity';
class Swap {
  async getActor() {
    return await GetAgent.swapActor();
  }

  async getCommonTokenActor(canisterId: string) {
    return await GetAgent.commonTokenActor(canisterId);
  }

  async swap(
    tokenIn: string,
    tokenOut: string,
    amountIn: string,
    amountOut: string,
    amountOutMin: string,
    amountInMax: string,
    decimalIn: number,
    decimalOut: number
  ) {
    try {
      const owner = authClient?.principal;
      const currentTime = (new Date().getTime() + 5 * 60 * 1000) * 10000000;
      const call = await (
        await this.getActor()
      ).swapExactTokensForTokens(
        parseAmount(amountIn, decimalIn),
        parseAmount(amountOutMin, decimalIn),
        [tokenIn, tokenOut],
        owner || '',
        currentTime
      );
      const call1 = await (
        await this.getActor()
      ).swapTokensForExactTokens(
        parseAmount(amountOut, decimalOut),
        parseAmount(amountInMax, decimalOut),
        [tokenIn, tokenOut],
        owner || '',
        currentTime
      );
      return [call, call1];
    } catch (e) {
      console.log(e, 'swap');
      return e;
    }
  }
}

export const SwapApi = new Swap();
