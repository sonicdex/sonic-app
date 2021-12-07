import { ENV } from '@/config';
import { SwapIDL } from '@/did';
import { usePlugStore } from '@/store';
import { parseAmount } from '@/utils/format';
import { Principal } from '@dfinity/principal';
import { Transaction } from '@psychedelic/plug-inpage-provider/dist/src/Provider';
import { CreateTransaction, Swap } from '../../models';

export interface SwapTransaction extends Transaction {}

export interface SwapExtraArgs {
  principal: Principal;
}

export const createSwapTransaction: CreateTransaction<Swap> = (
  { from, to, slippage }: Swap,
  onSuccess,
  onFail
) => {
  if (!from.token || !to.token) throw new Error('Tokens are required');
  const { principalId } = usePlugStore();
  if (!principalId) throw new Error('Principal is required');

  const amountIn = parseAmount(from.value, Number(from.token.decimals));
  const amountOutMin = parseAmount(to.value, Number(to.token.decimals));
  const currentTime = (new Date().getTime() + 5 * 60 * 1000) * 10000000;

  return {
    canisterId: ENV.canisterIds.swap,
    idl: SwapIDL.factory,
    methodName: 'swapExactTokensForTokens',
    onFail,
    onSuccess,
    args: [
      amountIn,
      amountOutMin,
      [from.token.id, to.token.id],
      Principal.fromText(principalId),
      BigInt(currentTime),
    ],
  };
};
