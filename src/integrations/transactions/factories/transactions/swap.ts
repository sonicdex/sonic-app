import { ENV } from '@/config';
import { SwapIDL } from '@/did';
import { getPrincipal } from '@/integrations/plug';
import { parseAmount } from '@/utils/format';
import { Principal } from '@dfinity/principal';
import { Transaction } from '@psychedelic/plug-inpage-provider/dist/src/Provider';
import { CreateTransaction, Swap } from '../../models';

export interface SwapTransaction extends Transaction {}

export interface SwapExtraArgs {
  principal: Principal;
}

export const createSwapTransaction: CreateTransaction<
  Swap,
  SwapTransaction,
  SwapExtraArgs
> = (
  {
    amountIn,
    amountOut,
    amountInMax,
    amountOutMin,
    decimalIn,
    decimalOut,
    tokenIn,
    tokenOut,
  }: Swap,
  onSuccess,
  onFail,
  { principal }
) => {
  const owner = principal;
  const currentTime = (new Date().getTime() + 5 * 60 * 1000) * 10000000;

  return {
    canisterId: ENV.canisterIds.swap,
    idl: SwapIDL.factory,
    methodName: 'swapExactTokensForTokens',
    onFail,
    onSuccess,
    args: [
      parseAmount(amountIn, Number(decimalIn)),
      parseAmount(amountOutMin, Number(decimalIn)),
      [tokenIn, tokenOut],
      owner || '',
      currentTime,
    ],
  };
};
