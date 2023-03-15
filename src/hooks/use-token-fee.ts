import { useBalances } from '@/hooks/use-balances';

type useTokenTaxCheckOptions = {
    tokenId?: string;
    tokenDecimals?: number;
    tokenValue?:string;
    tokenSymbol?:string;
};
export const useTokenTaxCheck = ({ tokenId ,tokenSymbol, tokenDecimals=1 , tokenValue='' ,}: useTokenTaxCheckOptions) => {
    const { sonicBalances, tokenBalances ,icpBalance } = useBalances();
    const tokenInfo={ wallet:0, sonic:0, taxInfo:{ input: 0 ,taxedValue:0, nonTaxedValue:0 ,netValue:0} }
    if(tokenId!='' && tokenId!='ICP' && sonicBalances && tokenBalances){
        var id= tokenId?tokenId:'';
        tokenInfo['wallet'] = tokenBalances[id]? tokenBalances[id]:0;
        tokenInfo['sonic'] = sonicBalances[id]?sonicBalances[id]:0;
    }else{ tokenInfo['wallet'] = icpBalance?icpBalance:0;}
    if(tokenValue){
      let tokenVal:number = parseFloat(tokenValue)
        if(tokenSymbol == 'YC'){
            let decimals = tokenDecimals?(10**tokenDecimals):1
            let sonicBalance = tokenInfo['sonic'] / decimals;
            if((sonicBalance > tokenVal)){
                tokenInfo.taxInfo.nonTaxedValue = tokenVal;
                tokenInfo.taxInfo.taxedValue = 0;
            } else {
                tokenInfo.taxInfo.nonTaxedValue = sonicBalance;
                tokenInfo.taxInfo.taxedValue = tokenVal - tokenInfo.taxInfo.nonTaxedValue;
            }    
            tokenInfo.taxInfo.netValue = tokenInfo.taxInfo.nonTaxedValue + (tokenInfo.taxInfo.taxedValue * (89/100));
        }
    }    
    return tokenInfo
}