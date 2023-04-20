import { getswapActor, fromHexString, getTokenActor } from '@/utils';

import { useState, useMemo, useEffect } from "react";

import { parseAmount } from '@/utils/format';
import { Principal } from '@dfinity/principal';
import { ENV } from '@/config';

import { CreateTransaction, Deposit } from '../../models';

import { TokenIDL } from '@/did';

export const intitICRCTokenDeposit = (deposit?:any): any => {
    const [tokenAcnt, setData] = useState('');
    useMemo(() => {
        getswapActor(false).then(actor => {
            actor.initateTransfer().then((data: string) => {
                setData(data);
            });
        });
    }, []);
    return tokenAcnt;
};

export const useICRCTransferMemo: CreateTransaction<Deposit> = (
    { amount, token, allowance = 0, tokenAcnt = '' },onSuccess, onFail) => useMemo(() => {
        if (!tokenAcnt && !token?.id) return false;
        var canId = token?.id ? token.id : '';
        var parsedAmount = amount ? parseAmount(amount, token?.decimals ? token?.decimals : 0) : BigInt(0);
        parsedAmount += token?.fee ? token?.fee : BigInt(0);
        var subacc: number[] = fromHexString(tokenAcnt);
        return {
            canisterId: canId,
            idl: TokenIDL.ICRC1.factory,
            methodName: 'icrc1_transfer',
            onSuccess: async (res: TokenIDL.DIP20.Result) => {
                if ('Err' in res) throw new Error(JSON.stringify(res.Err));
                if (onSuccess) onSuccess(res);
            },
            onFail,
            args: [{
                to: { owner: Principal.fromText(ENV.canistersPrincipalIDs.swap), subaccount: [subacc] },
                fee: [], memo: [], amount: parsedAmount, from_subaccount: [], created_at_time: []
            }],
        };
    }, [amount, token, tokenAcnt]);


export const useICRCDepositMemo: CreateTransaction<Deposit> = ({ amount, token, allowance = 0, tokenAcnt = '' }, onSuccess, onFail) => {
    const [tokenTrx, settokenTrxData] = useState({});
    useEffect((): any => {
        var canId = token?.id ? token.id : '';
        if (!tokenAcnt) return false;
        getTokenActor(canId, false).then(actor => {
            var parsedAmount = amount ? parseAmount(amount, token?.decimals ? token?.decimals : 0) : BigInt(0);
            parsedAmount += token?.fee ? token?.fee : BigInt(0);
            var subacc: number[] = fromHexString(tokenAcnt);
            actor.icrc1_transfer({
                to: { owner: Principal.fromText(ENV.canistersPrincipalIDs.swap), subaccount: [subacc] },
                fee: [], memo: [], amount: parsedAmount, from_subaccount: [], created_at_time: []
            }).then((data: any) => {
                settokenTrxData({ resp: data });
            }).catch(((err: any) => { return false; }))
        });
    }, [tokenAcnt]);
    return tokenTrx;
}
