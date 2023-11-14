import { fromHexString, getTokenActor, getswapActor } from '@/utils';

import { useState, useMemo, useEffect } from "react";

import { parseAmount } from '@/utils/format';
import { Principal } from '@dfinity/principal';
import { ENV } from '@/config';

import { CreateTransaction, Deposit } from '../../models';

import { TokenIDL, SwapIDL, } from '@/did';

export const intitICRCTokenDepositIn = (deposit?: any): any => {
    const [tokenAcnt, setData] = useState<undefined | boolean>();
    useMemo(() => {
        getswapActor(false).then(actor => {
            actor.initiateICRC1Transfer().then((data: any) => {
                setData(data);
            }).catch(e => { setData(false) });
        });
    }, [deposit]);
    return tokenAcnt;
};

export const intitICRCTokenDeposit: any = () => useMemo(() => {
    return {
        canisterId: ENV.canistersPrincipalIDs.swap,
        idl: SwapIDL.factory,
        methodName: 'initiateICRC1Transfer',
        updateNextStep: (trxResult: any, nextTrxItem: any,) => {
            nextTrxItem.args[0].to.subaccount = [trxResult]
        },
        onSuccess: () => { },
        onFail: () => { },
        args: []
    }
}, []);

export const verifyTokenDeposit: any = () => useMemo(() => {
    return {
        canisterId: ENV.canistersPrincipalIDs.swap,
        idl: SwapIDL.factory,
        methodName: 'get_transaction',
        onSuccess: () => { },
        onFail: () => { },
        args: []
    }
}, [])


export const useICRCTransferMemo: CreateTransaction<Deposit> = (
    { amount, token, allowance = 0, tokenAcnt = [] }, onSuccess, onFail) => useMemo(() => {
        if (!token?.id) { return; }
        var canId = token?.id ? token.id : '';
        var parsedAmount = amount ? parseAmount(amount, token?.decimals ? token?.decimals : 0) : BigInt(0);
        parsedAmount += token?.fee ? token?.fee : BigInt(0);
        var subacc: any = tokenAcnt.length ? tokenAcnt : [];

        var IDL = TokenIDL.ICRC1.factory;
        if (token?.symbol == 'SNEED') { IDL = TokenIDL.SNEED; }

        return {
            canisterId: canId,
            idl: IDL,
            methodName: 'icrc1_transfer',
            onSuccess: async (res: TokenIDL.ICRC1.Result) => {
                if ('Err' in res) throw new Error(JSON.stringify(res.Err));
                if (onSuccess) onSuccess(res);
            },
            updateNextStep: async (trxResult: any, nextTrxItem: any,) => {
                if (nextTrxItem.methodName == 'deposit') {
                    if (nextTrxItem.args[0].toString() == 'r7cp6-6aaaa-aaaag-qco5q-cai') {
                        var actor = await getTokenActor('r7cp6-6aaaa-aaaag-qco5q-cai', true);
                        var data = await actor.get_transaction(trxResult.Ok);      
                        if (!data.length) { data = await actor.get_transaction(trxResult.Ok); }
                        if (!data.length) { data = await actor.get_transaction(trxResult.Ok); }
                    }
                }
            },
            onFail,
            args: [{
                to: { owner: Principal.fromText(ENV.canistersPrincipalIDs.swap), subaccount: [subacc] },
                fee: [], memo: [], amount: parsedAmount, from_subaccount: [], created_at_time: []
            }],
        };
    }, [token, tokenAcnt]);

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
