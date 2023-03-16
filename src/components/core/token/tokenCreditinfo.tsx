import { Flex,Text  } from '@chakra-ui/react';
// import { getAppAssetsSources } from '@/config/utils';
// import { useBalances } from '@/hooks/use-balances';

import { useTokenTaxCheck } from '@/hooks'

export type TokenMetaProps = {
    tokenSymbol?: string;
    tokenDecimals?: number;
    tokenValue?: string;
    tokenId?: string;
    pageInfo?:string;
};

export const TokenDataMetaInfo: React.FC<TokenMetaProps> = ({
    tokenSymbol,
    tokenValue,
    tokenDecimals,
    tokenId,
    pageInfo,
}) => {
    var info = useTokenTaxCheck({tokenId ,tokenSymbol, tokenDecimals, tokenValue});
    console.log(info);
    // const { sonicBalances, tokenBalances ,icpBalance } = useBalances();
    // const tokenBalance={ wallet:0, sonic:0 }
    // if(tokenId!='' && tokenId!='ICP' && sonicBalances && tokenBalances){
    //     var id= tokenId?tokenId:'';
    //     tokenBalance['wallet'] = tokenBalances[id]? tokenBalances[id]:0;
    //     tokenBalance['sonic'] = sonicBalances[id]?sonicBalances[id]:0;
    // }else{ tokenBalance['wallet'] = icpBalance?icpBalance:0;}
   
    // var value = tokenValue ? parseFloat(tokenValue) : 0;
    // var taxedValue = 0;
    // var nonTaxedValue = 0;
    // if(pageInfo != "deposit") {
    //     console.log(tokenBalance);
    //     let decimals = tokenDecimals?(10**tokenDecimals):1
    //     let sonicBalance = tokenBalance['sonic'] / decimals;
    //     if((sonicBalance > value)){
    //         nonTaxedValue = value;
    //         taxedValue = 0;
    //     } else {
    //         nonTaxedValue = sonicBalance;
    //         taxedValue = value - nonTaxedValue;
    //     }    
    // } else {
    //     taxedValue = value;
    //     nonTaxedValue = 0;
    // }
    let isPrice = (): number => {
        // console.log(nonTaxedValue, taxedValue);
        // // var temp: number = tokenValue ? parseFloat(tokenValue) : 0;
        // var netValue = nonTaxedValue + (taxedValue * (89/100));
       // return 10.222;
        return parseFloat(info.taxInfo.netValue.toFixed(3));
    };
    let calcPrice: number = isPrice();

    return (
        <Flex mt={2} className="">
            {calcPrice&&tokenSymbol=='YC' ? (
                <Text color="var(--chakra-colors-gray-200)" >
                    { pageInfo == "swap" ? "Swapping for after 11% ": "Credited after 11%" }
                    <a style={{ color: 'var(--chakra-colors-blue-300)' }} target="_blank" 
                    href="https://blog.cigdao.com/cigdao-decentralization-sale-6856ad618f8c"> YC tax </a> : {calcPrice}
                </Text>
            ) : (
                ''
            )}
        </Flex>
    );
};