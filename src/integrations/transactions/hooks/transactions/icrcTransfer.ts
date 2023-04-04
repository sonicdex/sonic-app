import { getswapActor, fromHexString, getTokenActor } from '@/utils'; // fromHexString
import {  SwapIDL } from '@/did';
import { useState, useMemo } from "react";

// import { useMemo } from 'react';

import { parseAmount } from '@/utils/format';
import { Principal } from '@dfinity/principal';
import { ENV } from '@/config';
// import { AppTokenMetadata } from '@/models';
import { CreateTransaction, Deposit } from '../../models';

export const intitICRCTokenDeposit = (deposit: any): any => {
    const [tokenAcnt, setData] = useState('');
    useMemo(() => {
        getswapActor(false).then(actor => {
            actor.initateTransfer().then((data: string) => {
                setData(data);
            });
        });
    }, [deposit]);
    return tokenAcnt;
};
export const useICRCDepositEff: CreateTransaction<Deposit> = ({ amount, token, tokenAcnt = '', allowance = 0 }, onSuccess, onFail,) => {
    var subacc: number[] = fromHexString(tokenAcnt);
    subacc; onFail;
    var parsedAmount = amount ? parseAmount(amount, token?.decimals ? token?.decimals : 0) : BigInt(0);
    parsedAmount;
    var canId = token?.id ? token.id : '';
    useMemo(() => {
        getTokenActor(canId, false).then(actor => {
            console.log(actor);
        });
        return 'ok'
    }, [tokenAcnt])

}

export const useICRCDepositMemo: CreateTransaction<Deposit> = ({ amount, token, allowance = 0, tokenAcnt = '' }, onSuccess, onFail) => {
    const [tokenTrx, settokenTrxData] = useState({});
    useMemo(() => {
        var canId = token?.id ? token.id : '';
        if(!tokenAcnt) return false; 
        getTokenActor(canId, false).then(actor => {
            var parsedAmount = amount ? parseAmount(amount, token?.decimals ? token?.decimals : 0) : BigInt(0);
            var subacc: number[] = fromHexString(tokenAcnt);
            actor.icrc1_transfer({
                to: { owner: Principal.fromText(ENV.canistersPrincipalIDs.swap), subaccount: [subacc] },
                fee: [], memo: [], amount: parsedAmount, from_subaccount: [], created_at_time: []
            }).then((data: any) => {
                console.log(data)
                settokenTrxData({ resp:data});
               
            }).catch(((err: any) => {
                console.log('data' , err); 
                return false;    
            }))
        });
    }, [tokenAcnt]);
    return tokenTrx; 
}


export const useICRCDepositInit: CreateTransaction<Deposit> = ({ amount, token, allowance = 0 }, onSuccess, onFail) => {
    let transaction = {
        canisterId: ENV.canistersPrincipalIDs.swap,
        idl: SwapIDL.factory,
        methodName: 'initateTransfer',
        onSuccess: async (res: SwapIDL.Result) => {
            if ('err' in res) throw new Error(res.err);
            if (onSuccess) onSuccess(res);
        },
        onFail,
        args: [],
    }
    return transaction;
}
