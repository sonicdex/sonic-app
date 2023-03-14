import { Flex,Text  } from '@chakra-ui/react';
// import { getAppAssetsSources } from '@/config/utils';
import { useBalances } from '@/hooks/use-balances';


export type TokenMetaProps = {
    tokenSymbol?: string;
    tokenValue?: string;
    tokenId?: string;
    pageInfo?:string;
};

export const TokenDataMetaInfo: React.FC<TokenMetaProps> = ({
    tokenSymbol,
    tokenValue,
    tokenId,
    pageInfo,
}) => {
    const { sonicBalances, tokenBalances ,icpBalance } = useBalances();
    const tokenBalance={ wallet:0, sonic:0 }
    if(tokenId!='' && tokenId!='ICP' && sonicBalances && tokenBalances){
        var id= tokenId?tokenId:'';
        tokenBalance['wallet'] = tokenBalances[id]? tokenBalances[id]:0;
        tokenBalance['sonic'] = sonicBalances[id]?sonicBalances[id]:0;
    }else{ tokenBalance['wallet'] = icpBalance?icpBalance:0;}
   
    console.log(tokenBalance);
    
    let isPrice = (): number => {
        var temp: number = tokenValue ? parseFloat(tokenValue) : 0;
        temp = parseFloat((temp * (89/100)).toFixed(3));
        return temp;
    };
    let calcPrice: number = isPrice();

    return (
        <Flex mt={2} className="">
            {calcPrice&&tokenSymbol=='YC' ? (
                <Text color="var(--chakra-colors-gray-200)" >
                    Credited after 11% 
                    <a style={{ color: 'var(--chakra-colors-blue-300)' }} target="_blank" 
                    href="https://blog.cigdao.com/cigdao-decentralization-sale-6856ad618f8c"> YC tax </a> : {calcPrice}
                </Text>
            ) : (
                ''
            )}
        </Flex>
    );
};