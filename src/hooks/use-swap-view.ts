import { parseAmount } from '@/utils/format';
import { useActorStore } from '@/store/features/actor';
import { usePlugStore } from '@/store';
import { Principal } from '@dfinity/principal';

export const useSwapView = () => {
  const { actors } = useActorStore();
  const { swap: swapActor } = actors;

  const { principalId } = usePlugStore();

  async function swap(
    tokenIn: string,
    tokenOut: string,
    amountIn: string,
    amountOut: string,
    amountOutMin: string,
    amountInMax: string,
    decimalIn: number,
    decimalOut: number
  ) {
    if (principalId) {
      try {
        const currentTime = (new Date().getTime() + 5 * 60 * 1000) * 10000000;

        const call = await swapActor?.swapExactTokensForTokens(
          parseAmount(amountIn, decimalIn),
          parseAmount(amountOutMin, decimalIn),
          [tokenIn, tokenOut],
          Principal.fromText(principalId),
          BigInt(currentTime)
        );

        const call1 = await swapActor?.swapTokensForExactTokens(
          parseAmount(amountOut, decimalOut),
          parseAmount(amountInMax, decimalOut),
          [tokenIn, tokenOut],
          Principal.fromText(principalId),
          BigInt(currentTime)
        );

        return [call, call1];
      } catch (e) {
        console.log(e, 'swap');
      }
    }
  }

  return {
    swap,
  };
};
