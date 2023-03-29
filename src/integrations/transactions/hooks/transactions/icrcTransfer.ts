import { getswapActor } from '@/utils';
import { TokenIDL } from '@/did';
import { parseAmount } from '@/utils/format';
import { Principal } from '@dfinity/principal';


export const intitICRCTokenDeposit = async (): Promise<string> => {
    var sa = await getswapActor(false);
    var accmtId: string = await sa.initateTransfer();
    return accmtId;
}

export const useICRCDepositMemo = (depositInfo: any, tokenAcnt: string, onSuccess?: any, onFail?: any) => {
    const parsedAmount = depositInfo.amount ? parseAmount(depositInfo.amount, depositInfo.token.decimals) : BigInt(0);
    let transactions = {};

    transactions = {
        deposit: {
            canisterId: depositInfo.token.id,
            idl: TokenIDL.ICRC1.factory,
            methodName: 'icrc1_transfer',
            onSuccess: async (res: TokenIDL.ICRC1.Result) => {
                if ('Err' in res) throw new Error(JSON.stringify(res.Err));
                if (onSuccess) onSuccess(res);
            },
            onFail,
            args: [
                Principal.fromText('luozy-7ulxc-5mln7-ddzro-bpzpa-5j4y6-g7j7z-ae3xl-xil6m-jo3sy-gae'), parsedAmount
            ],
        }
    }
    return transactions;
}




