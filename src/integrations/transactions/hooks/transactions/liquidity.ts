import { Principal } from '@dfinity/principal';

import { Swap } from '@sonicdex/sonic-js';
import { useMemo } from 'react';

import { ENV } from '@/config';
import { SwapIDL } from '@/did';
import { AppLog } from '@/utils';
import { parseAmount } from '@/utils/format';

import { useBalances } from '@/hooks';

import { AddLiquidity, CreateTransaction, RemoveLiquidity, Withdraw } from '../../models';

export type LiquidityTransaction = {
  idl: any;
  canisterId: string;
  methodName: string;
  args: (responses?: any[]) => any[] | any[];
  onSuccess: (res: any) => Promise<any>;
  onFail: (err: any, responses?: any[]) => Promise<void>;
};

export interface LiquidityExtraArgs {
  principal: Principal;
}

type useTokenTaxCheckOptions = {
  balances?: any;
  tokenId?: string;
  tokenDecimals?: number;
  tokenValue?: string;
  tokenSymbol?: string;
};


import { getswapActor } from '@/utils';

var SwapActor: any;
(async () => { SwapActor = await getswapActor(false); })();

const useTokenTaxCheck = ({ balances, tokenId, tokenSymbol, tokenDecimals = 1, tokenValue = '', }: useTokenTaxCheckOptions) => {
  const { sonicBalances, tokenBalances, icpBalance } = balances;
  const tokenInfo = { wallet: 0, sonic: 0, taxInfo: { input: 0, taxedValue: 0, nonTaxedValue: 0, netValue: 0 } }
  if (tokenId != '' && tokenId != 'ICP' && sonicBalances && tokenBalances) {
    var id = tokenId ? tokenId : '';
    tokenInfo['wallet'] = tokenBalances[id] ? tokenBalances[id] : 0;
    tokenInfo['sonic'] = sonicBalances[id] ? sonicBalances[id] : 0;
  } else { tokenInfo['wallet'] = icpBalance ? icpBalance : 0; }
  if (tokenValue) {

    let tokenVal: number = parseFloat(tokenValue)
    if (tokenSymbol == 'YC') {
      let decimals = tokenDecimals ? (10 ** tokenDecimals) : 1
      let sonicBalance = tokenInfo['sonic'] / decimals;

      if ((sonicBalance > tokenVal)) {
        tokenInfo.taxInfo.nonTaxedValue = tokenVal;
        tokenInfo.taxInfo.taxedValue = 0;
      } else {
        tokenInfo.taxInfo.nonTaxedValue = sonicBalance;
        tokenInfo.taxInfo.taxedValue = tokenVal - tokenInfo.taxInfo.nonTaxedValue;
      }
      tokenInfo.taxInfo.netValue = tokenInfo.taxInfo.nonTaxedValue + (tokenInfo.taxInfo.taxedValue * (89 / 100));
    }
  }
  return tokenInfo
};

export const useAddLiquidityTransactionMemo: CreateTransaction<AddLiquidity> = (
  { token0, token1, slippage }: AddLiquidity, onSuccess, onFail) => {
  var token0Value = token0.value, token1Value = token1.value;
  var balances = useBalances();
  return useMemo(() => {
    if (!token0.metadata || !token1.metadata) throw new Error('Tokens are required');

    if (token0.metadata?.symbol == 'YC') {
      let info = useTokenTaxCheck({
        balances: balances, tokenId: token0.metadata ? token0.metadata.id : '',
        tokenSymbol: token0.metadata ? token0.metadata.symbol : '',
        tokenDecimals: token0.metadata ? token0.metadata.decimals : 1,
        tokenValue: token0.value ? token0.value : ''
      });

      token0Value = info.taxInfo.netValue.toString();
      var _temp = token0Value.split(".");

      token0Value = _temp[0] + '.' + (_temp[1] ? _temp[1].substring(0, 3) : '0');
    }

    if (token1.metadata?.symbol == 'YC') {
      let info = useTokenTaxCheck({
        balances: balances, tokenId: token1.metadata ? token1.metadata.id : '',
        tokenSymbol: token1.metadata ? token1.metadata.symbol : '',
        tokenDecimals: token1.metadata ? token1.metadata.decimals : 1,
        tokenValue: token1.value ? token1.value : ''
      });

      token1Value = info.taxInfo.netValue.toString();
      var _temp = token1Value.split(".");
      token1Value = _temp[0] + '.' + (_temp[1] ? _temp[1].substring(0, 3) : '0');
    }

    const amount0Desired = parseAmount(token0Value, token0.metadata.decimals);
    const amount1Desired = parseAmount(token1Value, token1.metadata.decimals);

    const amount0Min = parseAmount(
      Swap.getAmountMin({ amount: token0Value, slippage, decimals: token0.metadata.decimals }).toString(),
      token0.metadata.decimals
    );
    const amount1Min = parseAmount(
      Swap.getAmountMin({ amount: token1Value, slippage, decimals: token1.metadata.decimals }).toString(),
      token1.metadata.decimals
    );

    const currentTime = (new Date().getTime() + 15 * 60 * 1000) * 10000000;

    return {
      canisterId: ENV.canistersPrincipalIDs.swap,
      idl: SwapIDL.factory,
      methodName: 'addLiquidity',
      onFail: async (res: SwapIDL.Result) => {
        if ('err' in res) throw new Error(res.err);
        if (onFail) onFail(res);
      },
      onSuccess: async (res: SwapIDL.Result) => {
        if ('err' in res) throw new Error(res.err);
        if (onSuccess) onSuccess(res);
      },
      args: [
        Principal.fromText(token0.metadata?.id), Principal.fromText(token1.metadata?.id),
        amount0Desired, amount1Desired, amount0Min, amount1Min, BigInt(currentTime),
      ],
    };
  }, [token0, token1, slippage]);
};


export const useRemoveLiquidityTransactionMemo: CreateTransaction<RemoveLiquidity> = (
  {
    token0, token1, amount0Min, amount1Min, lpAmount, principalId,
  }: RemoveLiquidity, onSuccess, onFail
) =>
  useMemo(() => {

    if (!token0 || !token1) throw new Error('Token IDs are required');
    if (!principalId) throw new Error('Principal is required');

    const currentTime = (new Date().getTime() + 5 * 60 * 1000) * 10000000;

    return {
      canisterId: ENV.canistersPrincipalIDs.swap,
      idl: SwapIDL.factory,
      methodName: 'removeLiquidity',
      onFail: async (res: SwapIDL.Result) => {
        AppLog.error(
          `Remove liquidity transaction failed: token0=${token0.metadata.id} token1=${token1.metadata.id} principal=${principalId}`,
          res
        );
        if ('err' in res) throw new Error(res.err);
        if (onFail) onFail(res);
      },
      onSuccess: async (res: SwapIDL.Result) => {
        if ('err' in res) throw new Error(res.err);
        if (onSuccess) onSuccess(res);
      },
      args: [
        Principal.fromText(token0.metadata.id),
        Principal.fromText(token1.metadata.id),
        BigInt(Math.round(lpAmount)),
        parseAmount(String(amount0Min), token0.metadata.decimals),
        parseAmount(String(amount1Min), token1.metadata.decimals),
        Principal.fromText(principalId),
        BigInt(currentTime),
      ],
      updateNextStep: async (trxResult: any, nextTrxItem: any) => {
        if (nextTrxItem) {
          if (trxResult?.ok) {
            const data = await SwapActor?.getLastTransactionOutAmount();
            if (data?.RemoveLiquidityOutAmount) {
              nextTrxItem.args[1] = data?.RemoveLiquidityOutAmount[0];
            }
          }
        }
      }
    };
  }, [token0, token1]);



export const token0Withdraw: CreateTransaction<Withdraw> = ({ amount, token }, onSuccess, onFail) =>
  useMemo(() => {
    if (!token?.id || !amount) { return {}; }
    return {
      args: [Principal.fromText(token.id), parseAmount(amount, token.decimals)],
      canisterId: ENV.canistersPrincipalIDs.swap,
      idl: SwapIDL.factory,
      updateNextStep: async (trxResult: any, nextTrxItem: any) => {
        if (nextTrxItem) {
          if (trxResult?.ok) {
            const data = await SwapActor?.getLastTransactionOutAmount();
            if (data?.RemoveLiquidityOutAmount) {
              nextTrxItem.args[1] = data?.RemoveLiquidityOutAmount[1];
            }
          }
        }
      },
      methodName: 'withdraw',
      onSuccess: async (res: SwapIDL.Result) => {
        if ('err' in res) throw new Error(res.err);
        if (onSuccess) onSuccess(res);
      },
      onFail,
      
    };
  }, [amount, token, onFail, onSuccess]);
