import { Principal } from '@dfinity/principal';

import { Swap } from '@sonicdex/sonic-js';
import { useMemo } from 'react';

import { ENV } from '@/config';
import { SwapIDL } from '@/did';
import { parseAmount } from '@/utils/format';
import { useBalances } from '@/hooks';

import {  getswapActor } from '@/utils' ; //getSwapCapActor

import { CreateTransaction, SwapModel } from '../../models';


export type SwapTransaction = {
  idl: any;
  canisterId: string;
  methodName: string;
  args: (responses?: any[]) => any[] | any[];
  onSuccess: (res: any) => Promise<any>;
  onFail: (err: any, responses?: any[]) => Promise<void>;
};

export interface SwapExtraArgs {
  principal: Principal;
}

type useTokenTaxCheckOptions = {
  balances?: any;
  tokenId?: string;

  tokenDecimals?: number;
  tokenValue?: string;
  tokenSymbol?: string;
};

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
      tokenInfo.taxInfo.netValue = tokenInfo.taxInfo.nonTaxedValue + (tokenInfo.taxInfo.taxedValue * (88.9 / 100));
    }
  }
  return tokenInfo
};

// var SwapCapActor:any;
var SwapActor:any;

(async () => { 
  //SwapCapActor = await getSwapCapActor(true);
  SwapActor = await getswapActor(false);
})();

export const useSwapExactTokensTransactionMemo: CreateTransaction<SwapModel> = (
  { from, to, slippage, principalId, entryVal }: SwapModel, onSuccess, onFail) => {
  var fromValue = from.value;
  let balances = useBalances();
  return useMemo(() => {
    if (!from.metadata || !to.metadata) throw new Error('Tokens are required');
    if (!principalId) throw new Error('Principal is required');

    if (from.metadata?.symbol == 'YC') {
      let info = useTokenTaxCheck({
        balances: balances, tokenId: from.metadata ? from.metadata.id : '',
        tokenSymbol: from.metadata ? from.metadata.symbol : '',
        tokenDecimals: from.metadata ? from.metadata.decimals : 1,
        tokenValue: from.value ? from.value : ''
      });
      fromValue = info.taxInfo.netValue.toFixed(3);
    }

    const amountIn = parseAmount(fromValue, from.metadata.decimals);
    var outAmountMin = Swap.getAmountMin({ amount: to.value, slippage, decimals: to.metadata.decimals }).toNumber();

    if (from.metadata?.symbol == 'YC' && parseFloat(entryVal || '') > 0) {
      outAmountMin = outAmountMin - (outAmountMin * 0.11);
    }

    const currentTime = (new Date().getTime() + 5 * 60 * 1000) * 10000000;

    var amountOutMin = parseAmount(outAmountMin.toString(), to.metadata.decimals);
    return {
      canisterId: ENV.canistersPrincipalIDs.swap,
      idl: SwapIDL.factory,
      methodName: 'swapExactTokensForTokens',
      onFail,
      onSuccess: async (res: SwapIDL.Result) => {
        if ('err' in res) throw new Error(res.err);
        if (onSuccess) onSuccess(res);
      },
      args: [amountIn, amountOutMin, from.paths[to.metadata.id]?.path, Principal.fromText(principalId), BigInt(currentTime)],
      amountOutMin: outAmountMin,
      updateNextStep: async (trxResult: any, nextTrxItem: any, trxObj:any) => {
        if (nextTrxItem) {
          if (trxResult?.ok) {
            const data = await SwapActor?.getLastTransactionOutAmount();
            if(data?.SwapOutAmount) nextTrxItem.args[1] = data?.SwapOutAmount;
          }
        }
      },
    };
  }, [from.metadata, from.value, from.paths, to.metadata, to.value, principalId, slippage, onFail, onSuccess]);
};

// export const useSwapForExactTokensTransactionMemo: CreateTransaction<SwapModel> =
//  ({ from, to, slippage, principalId }: SwapModel, onSuccess, onFail) => {

//   var fromValue = from.value;
//   let balances = useBalances();

//   return useMemo(() => {
//     if (!from.metadata || !to.metadata) throw new Error('Tokens are required');
//     if (!principalId) throw new Error('Principal is required');
//     if (from.metadata?.symbol == 'YC') {
//       let info = useTokenTaxCheck({
//         balances: balances, tokenId: from.metadata ? from.metadata.id : '',
//         tokenSymbol: from.metadata ? from.metadata.symbol : '',
//         tokenDecimals: from.metadata ? from.metadata.decimals : 1,
//         tokenValue: from.value ? from.value : ''
//       });
//       fromValue = info.taxInfo.netValue.toFixed(3);
//     }

//     const amountOut = parseAmount(to.value, to.metadata.decimals);
//     const amountInMin = parseAmount(
//       Swap.getAmountMin({
//         amount: fromValue,
//         slippage,
//         decimals: from.metadata.decimals,
//       }).toString(),
//       to.metadata.decimals
//     );
//     const currentTime = (new Date().getTime() + 5 * 60 * 1000) * 10000000;

//     return {
//       canisterId: ENV.canistersPrincipalIDs.swap,
//       idl: SwapIDL.factory,
//       methodName: 'swapTokensForExactTokens',
//       onFail,
//       onSuccess: async (res: SwapIDL.Result) => {
//         if ('err' in res) throw new Error(res.err);
//         onSuccess(res);
//       },
//       args: [
//         amountOut,
//         amountInMin,
//         [from.metadata.id, to.metadata.id],
//         Principal.fromText(principalId),
//         BigInt(currentTime),
//       ],
//     };
//   }, [
//     from.metadata,
//     from.value,
//     to.metadata,
//     to.value,
//     principalId,
//     slippage,
//     onFail,
//     onSuccess,
//   ]);
// };

   
 // const data = await SwapCapActor?.get_user_transactions({ user: Principal.fromText(principalId), page: [], witness: false });
          //   var trxInfo: any = data.data.filter((item:any )=> (item.operation === "swap"));
          //   if (trxInfo.length > 0) {
          //         trxInfo = trxInfo[trxInfo.length - 1];
          //  //       console.log(trxInfo);
          //         const matchingDetail:any = trxInfo?.details?.find((detail: any) => detail[0] === "amountOut");
          //         if (matchingDetail.length > 0) {
          //           nextTrxItem.args[1] = matchingDetail[1]?.U64;
          //         }
          //     }